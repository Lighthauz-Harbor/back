var bcrypt = require("bcrypt-nodejs");
var uuid = require("uuid");
var neo4jInt = require("neo4j-driver").v1.int;
var nodemailer = require("nodemailer");

var smtpConfig = require("../config/smtp");

var UserSchema = function(dbDriver) {
    this.driver = dbDriver;

    this._generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    };

    this._comparePassword = function(password, hash) {
        return bcrypt.compareSync(password, hash);
    };

    this._checkParams = function(params) {
        if (!params.role || !params.name ||
            !params.username || !params.password) {

            return false;
        }

        if (typeof params.role !== "string" ||
            typeof params.name !== "string" ||
            typeof params.username !== "string" ||
            typeof params.password !== "string") {

            return false;
        }

        // date of birth has to be a string first, ("YYYY-MM-DD")
        // it will later be converted into a Date object, then saved in
        // Neo4j timestamp (milliseconds since Jan 1, 1970 UTC)
        if (params.dateOfBirth && typeof params.dateOfBirth !== "string") {
            return false;
        }

        if (params.bio && typeof params.bio !== "string") {
            return false;
        }

        if (params.profilePic && typeof params.profilePic !== "string") {
            return false;
        }

        return true;
    };

    this._createInDb = function(session, params, res) {
        session
            .run(
                "CREATE (:User {id: {id}, username: {username}, \
                password: {password}, name: {name}, role: {role}, \
                bio: {bio}, profilePic: {profilePic}, \
                dateOfBirth: {dateOfBirth}, createdAt: {createdAt}})", params)
            .then(function() {
                res.send({
                    message: "User successfully created!"
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Error creating user! Please try again."
                });
                session.close();
            });
    };

    this.create = function(req, res) {
        if (!this._checkParams(req.body)) {
            res.send({
                fail: "Wrong parameters in the request. Please contact the developer."
            });
        } else {
            var params = {
                id: uuid.v4(),
                name: req.body.name,
                username: req.body.username,
                password: this._generateHash(req.body.password),
                role: req.body.role,
                dateOfBirth: req.body.dateOfBirth ? 
                    (new Date(req.body.dateOfBirth)).getTime() : 
                    (new Date()).getTime(),
                bio: req.body.bio || "This is some bio",
                profilePic: req.body.profilePic || 
                    "http://res.cloudinary.com/lighthauz-harbor/image/upload/v1478504599/default-profile-pic_hroujz.png",
                createdAt: (new Date()).getTime()
            };

            var session = this.driver.session();
            var that = this;

            session
                .run("MATCH (u:User) WHERE u.username = {username} RETURN u.id",
                    {username: params.username})
                .then(function(result) {
                    if (result.records.length > 0) {
                        res.send({
                            fail: "Duplicate user! Please find another username."
                        });
                        session.close();
                    } else {
                        that._createInDb(session, params, res);
                    }
                })
                .catch(function(err) {
                    res.send({
                        fail: "Error finding user availability!"
                    });
                    session.close();
                });
        }
    };

    this.generateVerifCode = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (u:User) WHERE u.username = {username} \
                SET u.verifCode = {verifCode} \
                RETURN u.name, u.username, u.verifCode",
                {
                    username: req.body.username,
                    verifCode: (Math.random() + 1).toString(36).substr(2, 20)
                })
            .then(function(result) {
                var name = result.records[0].get("u.name");
                var email = result.records[0].get("u.username");
                var verifCode = result.records[0].get("u.verifCode");
                var verifLink = "https://lighthauz.herokuapp.com/user/auth/verify/" + email + "/" + verifCode;

                var transporter = nodemailer.createTransport(smtpConfig);

                var replyText = "Dear " + name + ",\n\n" +
                    "Thank you for registering into Lighthauz. To start using, please click the following verification link:\n\n" +
                    verifLink + "\n\n" +
                    "That is all from us. Have a nice day with Lighthauz. Thank you." + "\n\n" +
                    "Regards,\n\nLighthauz Harbor team.";

                var mailOptions = {
                    from: '"Lighthauz Harbor" <' + process.env.EMAIL_ADDR + '>',
                    to: email,
                    subject: "Verify your account",
                    text: replyText
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                        res.send({
                            fail: "Failed sending verification link to your email. Please click the link below.",
                            verifLink: verifLink
                        });
                        session.close();
                    } else {
                        console.log("Message sent: " + info.response);
                        res.send({
                            message: "A verification link has been sent to your email.\n" + 
                                "Please check it (if not found, check your spam folder)."
                        });
                        session.close();
                    }
                });
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed generating verification code. Please register again, or contact us at lighthauzharbor@gmail.com."
                });
                session.close();
            });
    };

    this._notifyVerifResults = function(session, result, username, 
                                        verifCode, res) {
        var name = result.records[0].get("u.name");

        session
            .run("MATCH (u:User) WHERE u.username = {username} \
                REMOVE u.verifCode",
                {
                    username: username
                })
            .then(function() {
                res.send("<h1>Congratulations, " + name + "!</h1>" +
                    "<p><strong>Your account has been verified!</strong></p>" + 
                    "<p>You may login to Lighthauz.</p>");
                session.close();
            })
            .catch(function(err) {
                res.send("<h1>Verification error.</h1>" +
                    "<p>Please <a " + 
                    "href=\"https://lighthauz.herokuapp.com/user/auth/verify/" +
                    username + "/" + verifCode + "\">click here</a> " + 
                    "to verify again.</p>");
                session.close();
            });
    };

    this._findVerifCode = function(session, that, result, 
                                   username, verifCode, res) {
        session
            .run("MATCH (u:User) WHERE u.verifCode = {verifCode} \
                RETURN u.name",
                {
                    verifCode: verifCode
                })
            .then(function(result) {
                that._notifyVerifResults(
                    session, result, username, verifCode, res);
            })
            .catch(function(err) {
                console.log(err);
                res.send("<h1>Verification error.</h1>" +
                    "<p>The verification link may be a wrong one." + 
                    '<a href="mailto:lighthauzharbor@gmail.com">' +
                    "Please send your email to us</a> about this problem.</p>" +
                    "<p>We apologize for your inconvenience.</p>");
                session.close();
            });
    };

    this.verifyAccount = function(req, res) {
        var username = req.params.username;
        var verifCode = req.params.code;

        var session = this.driver.session();
        var that = this;

        session
            .run("MATCH (u:User) WHERE u.username = {username} \
                RETURN u.name",
                {
                    username: username
                })
            .then(function(result) {
                that._findVerifCode(session, that, result, 
                    username, verifCode, res);
            })
            .catch(function(err) {
                res.send("<h1>Your account has not been registered.</h1>" +
                    "<p>Please register first in Lighthauz, " +
                    "then verify your account.</p>");
                session.close();
            });
    };

    this.isVerified = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (u:User) WHERE u.username = {username} AND \
                NOT exists(u.verifCode) RETURN u.username",
                {
                    username: req.params.username
                })
            .then(function(result) {
                res.send({
                    verified: true
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    verified: false
                });
                session.close();
            });
    };

    this.strategy = function(username, password, done) {
        var session = this.driver.session();
        var that = this;

        session
            .run("MATCH (u:User) WHERE u.username = {username} RETURN u", 
                {username: username})
            .then(function(result) {
                if (result.records.length === 0) {
                    return done(null, false, { message: "Incorrect username." });
                }

                var user = result.records[0].get(0).properties;
                if (!that._comparePassword(password, user.password)) {
                    return done(null, false, { message: "Incorrect password." });
                }
                return done(null, user);
            })
            .catch(function(err) {
                return done(err);
            });
    };

    this.deserialize = function(id, done) {
        var session = this.driver.session();
        session
            .run("MATCH (u:User) WHERE u.id = {id} RETURN u", 
                {id: id})
            .then(function(result) {
                var user = result.records[0].get(0).properties;
                done(null, user);
                session.close();
            })
            .catch(function(err) {
                done(err, false);
                session.close();
            });
    };

    this._sendDeactivationEmail = function(session, req, res, result) {
        var name = result.records[0].get("u.name");
        var email = result.records[0].get("u.username");

        session
            .run("MATCH (u:User) WHERE u.id = {id} \
                SET u.blocked = true",
                { id: req.body.id })
            .then(function() {
                var transporter = nodemailer.createTransport(smtpConfig);

                var replyText = "Dear " + name + ",\n\n" +
                    "We would like to inform you that your account " +
                    "has been deactivated. This means that you will " +
                    "not be able to login to Lighthauz, unless " + 
                    "further notice is given.\n\n" +
                    "Following is the reason from our administrator, " +
                    "on why they deactivated your account:\n\n" +
                    "\"" + req.body.reason + "\"\n\n" +
                    "That is all from us. We hope you may understand." + "\n\n" +
                    "Thank you for your attention." + "\n\n" +
                    "Regards,\n\nLighthauz Harbor team.";

                var mailOptions = {
                    from: '"Lighthauz Harbor" <' + process.env.EMAIL_ADDR + '>',
                    to: email,
                    subject: "Your account has been deactivated.",
                    text: replyText
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                        res.send({
                            message: "The user has been deactivated, " +
                                "but we failed sending your message " +
                                "via email. Please resend this " +
                                "message to ensure the email is sent."
                        });
                        session.close();
                    } else {
                        console.log("Message sent: " + info.response);
                        res.send({
                            message: "The user has been deactivated, " +
                                "and your message has been sent."
                        });
                        session.close();
                    }
                });
            })
            .catch(function(err) {
                res.send({
                    message: "Failed deactivating user. Please try again."
                });
                session.close();
            });
    };

    this.deactivateUser = function(req, res) {
        var session = this.driver.session();
        var that = this;

        session
            .run("MATCH (u:User) WHERE u.id = {id} RETURN u.name, u.username",
                { id: req.body.id })
            .then(function(result) {
                that._sendDeactivationEmail(session, req, res, result);
            })
            .catch(function(err) {
                res.send({
                    message: "User is not found. Failed deactivating. Please try again."
                });
                session.close();
            });
    };

    this._sendReactivationEmail = function(session, req, res, result) {
        var name = result.records[0].get("u.name");
        var email = result.records[0].get("u.username");

        session
            .run("MATCH (u:User) WHERE u.id = {id} \
                SET u.blocked = false",
                { id: req.body.id })
            .then(function() {
                var transporter = nodemailer.createTransport(smtpConfig);

                var replyText = "Dear " + name + ",\n\n" +
                    "Your account has been re-activated now. " +
                    "This means that you will be able to log in " + 
                    "to Lighthauz again.\n\n" +
                    "Following is the reason from our administrator, " +
                    "on why they restored your account:\n\n" +
                    "\"" + req.body.reason + "\"\n\n" +
                    "That is all from us. We hope you may understand." + "\n\n" +
                    "Thank you for your attention." + "\n\n" +
                    "Regards,\n\nLighthauz Harbor team.";

                var mailOptions = {
                    from: '"Lighthauz Harbor" <' + process.env.EMAIL_ADDR + '>',
                    to: email,
                    subject: "Your account has now been re-activated.",
                    text: replyText
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                        res.send({
                            message: "The user has been re-activated, " +
                                "but we failed sending your message " +
                                "via email. Please resend this " +
                                "message to ensure the email is sent."
                        });
                        session.close();
                    } else {
                        console.log("Message sent: " + info.response);
                        res.send({
                            message: "The user has been re-activated, " +
                                "and your message has been sent."
                        });
                        session.close();
                    }
                });
            })
            .catch(function(err) {
                res.send({
                    message: "Failed re-activating user. Please try again."
                });
                session.close();
            });
    };

    this.reactivateUser = function(req, res) {
        var session = this.driver.session();
        var that = this;

        session
            .run("MATCH (u:User) WHERE u.id = {id} RETURN u.name, u.username",
                { id: req.body.id })
            .then(function(result) {
                that._sendReactivationEmail(session, req, res, result);
            })
            .catch(function(err) {
                res.send({
                    message: "User is not found. Failed re-activating. Please try again."
                });
                session.close();
            });
    };

    this.isBlocked = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (u:User) WHERE u.id = {id} RETURN u.blocked",
                { id: req.params.id })
            .then(function(result) {
                res.send({
                    blocked: result.records[0].get("u.blocked") || false
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    blocked: false
                });
                session.close();
            });
    };

    this.getSingle = function(req, res) {
        var session = this.driver.session();
        session
            .run("MATCH (u:User) WHERE u.id = {id} \
                RETURN u.id, u.name, u.username, u.bio, u.profilePic, \
                u.dateOfBirth, u.createdAt",
                { id: req.params.id })
            .then(function(result) {
                var user = result.records[0];
                res.send({
                    id: user.get("u.id"),
                    name: user.get("u.name"),
                    username: user.get("u.username"),
                    bio: user.get("u.bio"),
                    profilePic: user.get("u.profilePic"),
                    dateOfBirth: Number(user.get("u.dateOfBirth")),
                    createdAt: Number(user.get("u.createdAt"))
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "User not found. Please try again."
                });
                session.close();
            });
    };

    this.getName = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (u:User) WHERE u.id = {id} RETURN u.name",
            { id: req.params.id })
            .then(function(result) {
                res.send({
                    name: result.records[0].get("u.name")
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed getting user's name."
                });
                session.close();
            });
    };

    this.listUsers = function(req, res) {
        var session = this.driver.session();
        session
            .run("MATCH (u:User) WHERE u.role = 'user' \
                RETURN u.id, u.name, u.username, u.profilePic, \
                u.bio, u.createdAt \
                ORDER BY u.createdAt DESC")
            .then(function(result) {
                res.send({
                    results: result.records.map(function(record) {
                        return {
                            id: record.get("u.id"),
                            name: record.get("u.name"),
                            username: record.get("u.username"),
                            profilePic: record.get("u.profilePic"),
                            bio: record.get("u.bio"),
                            createdAt: Number(record.get("u.createdAt"))
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed fetching list of users."
                });
                session.close();
            });
    };

    this.search = function(req, res) {
        var nameRegex = "(?i).*" + req.params.term + ".*";
        var session = this.driver.session();
        session
            .run("MATCH (u:User) WHERE u.name =~ {nameRegex} \
                AND u.role = 'user' \
                RETURN u.id, u.name, u.username, u.profilePic, \
                u.bio, u.createdAt \
                ORDER BY u.name ASC",
                { nameRegex: nameRegex })
            .then(function(result) {
                res.send({
                    results: result.records.map(function(record) {
                        return {
                            id: record.get("u.id"),
                            name: record.get("u.name"),
                            username: record.get("u.username"),
                            profilePic: record.get("u.profilePic"),
                            bio: record.get("u.bio"),
                            createdAt: Number(record.get("u.createdAt"))
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed searching for user. Please try again."
                });
                session.close();
            });
    };

    this.update = function(req, res) {
        var session = this.driver.session();

        if (req.body.password === "") { // password is unchanged
            if (req.body.profilePic) { // profile picture is changed
                session
                    .run("MATCH (u:User) WHERE u.id = {id} \
                        SET u.name = {name}, \
                            u.username = {username}, \
                            u.dateOfBirth = {dateOfBirth}, \
                            u.bio = {bio}, \
                            u.profilePic = {profilePic}",
                            {
                                id: req.body.id,
                                name: req.body.name,
                                username: req.body.username,
                                dateOfBirth: req.body.dateOfBirth,
                                bio: req.body.bio,
                                profilePic: req.body.profilePic
                            })
                    .then(function() {
                        res.send({
                            message: "Successfully updated user! (Without changing password)"
                        });
                        session.close();
                    })
                    .catch(function(err) {
                        res.send({
                            message: "Failed updating user. Please try again."
                        });
                        session.close();
                    }); 
            } else { // profile picture remains unchanged
                session
                    .run("MATCH (u:User) WHERE u.id = {id} \
                        SET u.name = {name}, \
                            u.username = {username}, \
                            u.dateOfBirth = {dateOfBirth}, \
                            u.bio = {bio}",
                            {
                                id: req.body.id,
                                name: req.body.name,
                                username: req.body.username,
                                dateOfBirth: req.body.dateOfBirth,
                                bio: req.body.bio
                            })
                    .then(function() {
                        res.send({
                            message: "Successfully updated user! (Without changing password)"
                        });
                        session.close();
                    })
                    .catch(function(err) {
                        res.send({
                            message: "Failed updating user. Please try again."
                        });
                        session.close();
                    });
            }
        } else { // change password
            if (req.body.profilePic) { // profile picture is changed
                session
                    .run("MATCH (u:User) WHERE u.id = {id} \
                        SET u.name = {name}, \
                            u.username = {username}, \
                            u.dateOfBirth = {dateOfBirth}, \
                            u.bio = {bio}, \
                            u.password = {password}, \
                            u.profilePic = {profilePic}", 
                            {
                                id: req.body.id,
                                name: req.body.name,
                                username: req.body.username,
                                password: this._generateHash(req.body.password),
                                dateOfBirth: req.body.dateOfBirth,
                                bio: req.body.bio,
                                profilePic: req.body.profilePic
                            })
                    .then(function() {
                        res.send({
                            message: "Successfully updated user! The password has also been changed."
                        });
                        session.close();
                    })
                    .catch(function(err) {
                        res.send({
                            message: "Failed updating user. Please try again."
                        });
                        session.close();
                    });
            } else { // profile picture is unchanged
                session
                    .run("MATCH (u:User) WHERE u.id = {id} \
                        SET u.name = {name}, \
                            u.username = {username}, \
                            u.dateOfBirth = {dateOfBirth}, \
                            u.bio = {bio}, \
                            u.password = {password}", 
                            {
                                id: req.body.id,
                                name: req.body.name,
                                username: req.body.username,
                                password: this._generateHash(req.body.password),
                                dateOfBirth: req.body.dateOfBirth,
                                bio: req.body.bio
                            })
                    .then(function() {
                        res.send({
                            message: "Successfully updated user! The password has also been changed."
                        });
                        session.close();
                    })
                    .catch(function(err) {
                        res.send({
                            message: "Failed updating user. Please try again."
                        });
                        session.close();
                    });
            }
        }
    }

    this.deleteUsers = function(req, res) {
        var session = this.driver.session();

        // delete user's ideas first
        session
            .run("MATCH (u:User)-[m:MAKE]->(i:Idea) \
                WHERE u.id IN {ids} \
                DETACH DELETE i",
                { ids: req.body.ids })
            .then(function() {
                // then delete the user themself
                session
                    .run("MATCH (u:User) WHERE u.id IN {ids} \
                        DETACH DELETE u", { ids: req.body.ids })
                    .then(function() {
                        res.send({
                            message: "Successfully deleted user(s), " +
                                "along with their data."
                        });
                        session.close();
                    })
                    .catch(function(err) {
                        res.send({
                            message: "Successfully deleted the users' ideas, " +
                                "but not the users' data. Please try again."
                        });
                        session.close();
                    });
            })
            .catch(function(err) {
                res.send({
                    message: "Failed deleting selected user(s). Please try again."
                });
                session.close();
            });
    };

    this.getTotalUsersCount = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (u:User) WHERE u.role = 'user' RETURN count(u)")
            .then(function(result) {
                res.send({
                    count: neo4jInt(result.records[0].get("count(u)")).toNumber()
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    count: -1
                });
                session.close();
            });
    };

    this.getUserActivityCount = function(req, res) {
        var session = this.driver.session();
        
        session
            .run("MATCH (:User)-[r]->() RETURN count(r)")
            .then(function(result) {
                res.send({
                    count: neo4jInt(result.records[0].get("count(r)")).toNumber()
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    count: -1
                });
                session.close();
            });
    };

    this.getConnections = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (from:User)-[c:CONNECT]-(to:User) \
                WHERE from.id = {userId} AND c.status = 1 \
                RETURN to.id, to.name, to.username, to.bio, \
                to.profilePic, c.lastChanged \
                ORDER BY c.lastChanged DESC",
                {
                    userId: req.params.userId
                })
            .then(function(result) {
                res.send({
                    connections: result.records.map(function(record) {
                        return {
                            id: record.get("to.id"),
                            name: record.get("to.name"),
                            email: record.get("to.username"),
                            bio: record.get("to.bio"),
                            profilePic: record.get("to.profilePic"),
                            timestamp: Number(record.get("c.lastChanged"))
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    connections: []
                });
                session.close();
            });
    };

    this.getSentConnectionRequests = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (you:User)-[c:CONNECT]->(other:User) \
                WHERE you.id = {userId} AND c.status = 0 \
                RETURN other.id, other.name, other.username, \
                other.bio, other.profilePic, c.lastChanged \
                ORDER BY c.lastChanged DESC",
                {
                    userId: req.params.userId
                })
            .then(function(result) {
                res.send({
                    sentByUser: result.records.map(function(record) {
                        return {
                            id: record.get("other.id"),
                            name: record.get("other.name"),
                            email: record.get("other.username"),
                            bio: record.get("other.bio"),
                            profilePic: record.get("other.profilePic"),
                            timestamp: Number(record.get("c.lastChanged"))
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    sentByUser: []
                });
                session.close();
            });
    };

    this.getReceivedConnectionRequests = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (other:User)-[c:CONNECT]->(you:User) \
                WHERE you.id = {userId} AND c.status = 0 \
                RETURN other.id, other.name, other.username, \
                other.bio, other.profilePic, c.lastChanged \
                ORDER BY c.lastChanged DESC",
                {
                    userId: req.params.userId
                })
            .then(function(result) {
                res.send({
                    receivedByUser: result.records.map(function(record) {
                        return {
                            id: record.get("other.id"),
                            name: record.get("other.name"),
                            email: record.get("other.username"),
                            bio: record.get("other.bio"),
                            profilePic: record.get("other.profilePic"),
                            timestamp: Number(record.get("c.lastChanged"))
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    receivedByUser: []
                });
                session.close();
            });
    };

    this.isConnected = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (u1:User)-[c:CONNECT]-(u2:User) \
                WHERE u1.id = {user1} AND u2.id = {user2} \
                RETURN c.status",
                {
                    user1: req.params.user1,
                    user2: req.params.user2
                })
            .then(function(result) {
                res.send({
                    // taking into account rejected connections, hence `=== 1`
                    connected: neo4jInt(result.records[0].get("c.status"))
                        .toNumber() === 1
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    // because there is no :CONNECT relationship found
                    connected: false
                });
                session.close();
            });
    };

    this._createConnectionRequest = function(session, req, res) {
        session
            .run("MATCH (from:User), (to:User) \
                WHERE from.id = {fromId} AND to.id = {toId} \
                CREATE (from)-[c:CONNECT \
                {status: 0, lastChanged: {lastChanged}}]->(to)",
                {
                    fromId: req.body.fromId,
                    toId: req.body.toId,
                    lastChanged: (new Date()).getTime()
                })
            .then(function() {
                res.send({
                    message: "Successfully sent request to connect."
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    message: "Error sending request. User may not exist. Please try again."
                });
                session.close();
            });
    };

    this.sendConnectionRequest = function(req, res) {
        var session = this.driver.session();
        var that = this;

        session
            .run("MATCH (from:User)-[c:CONNECT]-(to:User) \
                WHERE from.id = {fromId} AND to.id = {toId} \
                RETURN c.status",
                {
                    fromId: req.body.fromId,
                    toId: req.body.toId
                })
            .then(function(result) { // if connected, check user conn. status
                // connection status:
                // 0 = only sent request, 1 = accepted
                var status = neo4jInt(result.records[0].get("c.status")).toNumber();

                switch (status) {
                    case 1:
                        res.send({
                            message: "Both users are already connected."
                        });
                        session.close();
                        break;
                    case 0:
                        res.send({
                            message: "Your request has previously been sent. Please wait for them to accept."
                        });
                        session.close();
                        break;
                }
            })
            .catch(function(err) { // not an error, just connect both users
                that._createConnectionRequest(session, req, res);
            });
    };

    this._setRequestForAcceptance = function(session, req, res) {
        session
            .run("MATCH (from:User)-[c:CONNECT]->(to:User) \
                WHERE from.id = {fromId} AND to.id = {toId} \
                SET c.status = 1, c.lastChanged = {lastChanged}",
                {
                    fromId: req.body.fromId,
                    toId: req.body.toId,
                    lastChanged: (new Date()).getTime()
                })
            .then(function() {
                res.send({
                    message: "You have been connected!"
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    message: "Failed to accept connection. Please try again."
                });
                session.close();
            });
    };

    this._notifyMustRequest = function(session, res) {
        res.send({
            message: "You need to send connection request to them first."
        });
        session.close();
    };

    this.acceptRequest = function(req, res) {
        var session = this.driver.session();
        var that = this;

        session
            .run("MATCH (from:User)-[c:CONNECT]-(to:User) \
                WHERE from.id = {fromId} AND to.id = {toId} \
                RETURN c.status",
                {
                    fromId: req.body.fromId,
                    toId: req.body.toId
                })
            .then(function(result) {
                var status = neo4jInt(result.records[0].get("c.status")).toNumber();

                switch (status) {
                    case 1:
                        res.send({
                            message: "Both of you are already connected!"
                        });
                        session.close();
                        break;
                    case 0:
                        that._setRequestForAcceptance(session, req, res);
                        break;
                }
            })
            .catch(function(err) {
                that._notifyMustRequest(session, res);
            });
    };

    this.removeConnectionOrRequest = function(req, res) {
        var session = this.driver.session();
        session
            .run("MATCH (from:User)-[c:CONNECT]-(to:User) \
                WHERE from.id = {fromId} AND to.id = {toId} \
                DELETE c",
                {
                    fromId: req.body.fromId,
                    toId: req.body.toId
                })
            .then(function() {
                res.send({
                    message: "Successfully removed connection/request."
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    message: "Failed removing connection. Please try again."
                });
                session.close();
            });
    };
};

module.exports = UserSchema;