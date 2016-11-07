var uuid = require("uuid");
var bcrypt = require("bcrypt-nodejs");

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

    this.create = function(req, res) {
        if (!this._checkParams(req.body)) {
            res.status(400).send("Wrong parameters: please check the request.");
        }

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

        session
            .run("MATCH (u:User) WHERE u.username = {username} RETURN u", 
                {username: params.username})
            .then(function(result) {
                if (result.records.length > 0) {
                    res.status(501).send("Duplicate user!");
                } else {
                    session
                        .run(
                            "CREATE (:User {id: {id}, username: {username}, \
                            password: {password}, name: {name}, role: {role}, \
                            bio: {bio}, profilePic: {profilePic}, \
                            dateOfBirth: {dateOfBirth}, createdAt: {createdAt}})", params)
                        .then(function() {
                            res.status(201).send("User successfully created!");
                            session.close();
                        })
                        .catch(function(err) {
                            res.status(501).send(err);
                            session.close();
                        });
                }
            })
            .catch(function(err) {
                res.status(501).send("Error finding user availability!");
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

    this.find = function(req, res) {
        var session = this.driver.session();
        session
            .run("MATCH (u:User) WHERE u.username = {username} RETURN u", 
                {username: req.params.username})
            .then(function(result) {
                var user = result.records[0].get(0).properties;
                res.send(user);
                session.close();
            })
            .catch(function(err) {
                res.send(err);
                session.close();
            });
    };

    this.listUsers = function(req, res) {
        var session = this.driver.session();
        session
            .run("MATCH (u:User) WHERE u.role = 'user' RETURN u \
                ORDER BY u.createdAt DESC")
            .then(function(result) {
                res.send({
                    results: result.records.map(function(record) {
                        var user = record.get(0).properties;
                        // don't send id and password in this response
                        return {
                            name: user.name,
                            username: user.username,
                            role: user.role,
                            bio: user.bio,
                            profilePic: user.profilePic,
                            dateOfBirth: (new Date(user.dateOfBirth)).toDateString(),
                            createdAt: (new Date(user.createdAt)).toDateString(),
                            // TODO insert user's last activity below 
                            // (in `lastActivity` property)
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

    this.deleteUsers = function(req, res) {
        var session = this.driver.session();
        var usernames = req.body.usernames;
        session
            .run("MATCH (u:User) WHERE u.username IN {usernames} DETACH DELETE u",
                {usernames: usernames})
            .then(function(result) {
                res.send({
                    message: "Successfully deleted users!"
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    message: "Failed deleting selected users. Please try again."
                });
                session.close();
            });
    };
};

module.exports = UserSchema;