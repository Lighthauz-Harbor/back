var uuid = require("uuid");
var neo4jInt = require("neo4j-driver").v1.int;
var nodemailer = require("nodemailer");

var smtpConfig = require("../config/smtp");

var IdeaSchema = function(dbDriver) {
    this.driver = dbDriver;

    this._createInDb = function(session, createQuery, result, req, res) {
        var authorId = result.records[0].get(0);
        session
            .run(createQuery, {
                authorId: authorId,
                categoryName: req.body.category,
                createdAt: (new Date()).getTime(),
                ideaId: uuid.v4(),
                title: req.body.title,
                description: req.body.description,
                visibility: neo4jInt(req.body.visibility),
                background: req.body.background,
                problem: req.body.problem,
                solution: req.body.solution,
                extraLink: req.body.extraLink,
                pic: req.body.pic || 
                    "https://res.cloudinary.com/lighthauz-harbor/image/upload/v1479742560/default-idea-pic_wq1dzc.png",
                strengths: req.body.strengths,
                weaknesses: req.body.weaknesses,
                opportunities: req.body.opportunities,
                threats: req.body.threats,
                valueProposition: req.body.valueProposition,
                customerSegments: req.body.customerSegments,
                customerRelationships: req.body.customerRelationships,
                channels: req.body.channels,
                keyActivities: req.body.keyActivities,
                keyResources: req.body.keyResources,
                keyPartners: req.body.keyPartners,
                costStructure: req.body.costStructure,
                revenueStreams: req.body.revenueStreams,
            })
            .then(function() {
                res.send({
                    message: "Successfully created idea."
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    message: "Error creating idea. Please try again."
                });
                session.close();
            });
    };

    this.create = function(req, res) {
        var session = this.driver.session();
        var that = this;

        // match the author's username with an existing one
        var matchQuery = "MATCH (u: User) WHERE u.username = {author} RETURN u.id";

        // then check for existing category (or make a new one, 
        // if it doesn't exist)
        var createQuery = "MATCH (u: User) WHERE u.id = {authorId} \
            MERGE (c: Category {name: {categoryName}}) \
            CREATE (u)-[m:MAKE {createdAt: {createdAt}, lastChanged: {createdAt}}]->(i:Idea \
                { \
                    id: {ideaId}, \
                    title: {title}, \
                    description: {description}, \
                    visibility: {visibility}, \
                    background: {background}, \
                    problem: {problem}, \
                    solution: {solution}, \
                    pic: {pic}, \
                    extraLink: {extraLink}, \
                    strengths: {strengths}, \
                    weaknesses: {weaknesses}, \
                    opportunities: {opportunities}, \
                    threats: {threats}, \
                    valueProposition: {valueProposition}, \
                    customerSegments: {customerSegments}, \
                    customerRelationships: {customerRelationships}, \
                    channels: {channels}, \
                    keyActivities: {keyActivities}, \
                    keyResources: {keyResources}, \
                    keyPartners: {keyPartners}, \
                    costStructure: {costStructure}, \
                    revenueStreams: {revenueStreams} \
                })<-[:CATEGORIZE]-(c)";

        session
            .run(matchQuery, {
                author: req.body.author
            })
            .then(function(result) {
                that._createInDb(session, createQuery, result, req, res);
            })
            .catch(function(err) {
                res.send({
                    message: "User/author doesn't exist. Please try again."
                });
                session.close();
            });
    };

    this._sendPartnerInvitationEmail = function(session, req, res,
                                                author, idea, category) {
        session
            .run("MATCH (u:User) WHERE u.id IN {partnerIds} \
                RETURN u.id, u.name, u.username",
                {
                    partnerIds: req.body.partnerIds
                })
            .then(function(result) {
                var transporter = nodemailer.createTransport(smtpConfig);

                var max = result.records.length - 1;
                result.records.map(function(partner, idx) {
                    var partner = {
                        id: partner.get("u.id"),
                        name: partner.get("u.name"),
                        email: partner.get("u.username")
                    };

                    var collaborationLink =
                        "https://lighthauz.herokuapp.com/ideas/collaborate/" +
                        req.body.ideaId + "/" + partner.id;

                    var invitationText = "Dear " + partner.name + ",\n\n" +
                        "Our user, " + author + ", just made an idea called " + idea.title +
                        " (category: " + category + "), and the author is looking forward to collaborate " +
                        "with you in it!\n\n" +
                        "Following is a description of his idea:\n" + idea.description +
                        "\n\n" + "For more details of their idea, you can search it by its title " +
                        "in our app, and come back to this email if you want to take part.\n\n" +
                        "If you would like to collaborate with them, please go to the following link:\n" +
                        collaborationLink + "\n\n" +
                        "That is all from us. Thank you for your attention.\n\n" +
                        "Regards,\n\nLighthauz Harbor team.";

                    var mailOptions = {
                        from: '"Lighthauz Harbor" <' + process.env.EMAIL_ADDR + '>',
                        to: partner.email,
                        subject: author + " would like to collaborate with you on their idea!",
                        text: invitationText
                    };

                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error);
                            res.send({
                                fail: "Failed sending invitiation emails to selected partners. " +
                                    "Please try again."
                            });
                            session.close();
                        } else if (idx === max) {
                            console.log("Message sent: " + info.response);
                            res.send({
                                message: "Invitation emails to the selected partners have been sent. " +
                                    "Wait until they accept them."
                            });
                            session.close();
                        }
                    });
                });
            })
            .catch(function(err) {
                res.fail({
                    fail: "Failed finding partners in database. Please try again."
                });
                session.close();
            });
    };

    this.invitePartners = function(req, res) {
        var session = this.driver.session();
        var that = this;

        session
            .run("MATCH (u:User)-[:MAKE]->(i:Idea)<-[:CATEGORIZE]-(c:Category) \
                WHERE i.id = {ideaId} \
                RETURN u.name, i.id, i.title, i.description, c.name",
                {
                    ideaId: req.body.ideaId
                })
            .then(function(result) {
                var author = result.records[0].get("u.name");
                var idea = {
                    id: result.records[0].get("i.id"),
                    title: result.records[0].get("i.title"),
                    description: result.records[0].get("i.description")
                };
                var category = result.records[0].get("c.name");

                that._sendPartnerInvitationEmail(
                    session, req, res, author, idea, category);
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed finding idea object in database. Please try again."
                });
                session.close();
            });
    };

    this.listIdeas = function(req, res) {
        var session = this.driver.session();
        // m.lastChanged: "modified at"
        session
            .run("MATCH (i:Idea)<-[m:MAKE]-(u:User) RETURN \
                i.id, i.title, i.description, u.username, m.lastChanged \
                ORDER BY m.lastChanged DESC")
            .then(function(result) {
                res.send({
                    results: result.records.map(function(record) {
                        return {
                            id: record.get("i.id"),
                            title: record.get("i.title"),
                            description: record.get("i.description"),
                            author: record.get("u.username"),
                            lastChanged: (
                                new Date(record.get("m.lastChanged"))
                            ).toDateString(),
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed fetching list of ideas."
                });
                session.close();
            });
    };

    this.searchAsAdmin = function(req, res) {
        var titleRegex = "(?i).*" + req.params.term + ".*";
        var session = this.driver.session();
        session
            .run("MATCH (u:User)-[m:MAKE]->(i:Idea) \
                WHERE i.title =~ {titleRegex} \
                RETURN i.id, i.title, i.description, \
                m.lastChanged, u.username ORDER BY i.title ASC",
                { titleRegex: titleRegex })
            .then(function(result) {
                res.send({
                    results: result.records.map(function(record) {
                        return {
                            id: record.get("i.id"),
                            title: record.get("i.title"),
                            description: record.get("i.description"),
                            author: record.get("u.username"),
                            lastChanged: (
                                new Date(record.get("m.lastChanged"))
                            ).toDateString(),
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed searching for idea. Please try again."
                });
                session.close();
            });
    };

    this.searchByTitle = function(req, res) {
        var titleRegex = "(?i).*" + req.params.title + ".*";
        var session = this.driver.session();
        session
            .run("MATCH (:User)-[m:MAKE]->(i:Idea)<-[:CATEGORIZE]-(c:Category) \
                WHERE i.title =~ {titleRegex} \
                RETURN i.id, i.title, i.description, i.pic, \
                c.name, m.lastChanged \
                ORDER BY m.lastChanged DESC", 
                { titleRegex: titleRegex })
            .then(function(result) {
                res.send({
                    results: result.records.map(function(record) {
                        return {
                            id: record.get("i.id"),
                            title: record.get("i.title"),
                            description: record.get("i.description"),
                            pic: record.get("i.pic"),
                            category: record.get("c.name")
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed searching for ideas. Please try again."
                });
                session.close();
            });
    };

    this.searchByCategory = function(req, res) {
        var categoryRegex = "(?i).*" + req.params.category + ".*";
        var session = this.driver.session();

        session
            .run("MATCH (:User)-[m:MAKE]->(i:Idea)<-[:CATEGORIZE]-(c:Category) \
                WHERE c.name =~ {categoryRegex} \
                RETURN i.id, i.title, i.description, i.pic, \
                c.name, m.lastChanged \
                ORDER BY m.lastChanged DESC",
                { categoryRegex: categoryRegex })
            .then(function(result) {
                res.send({
                    results: result.records.map(function(record) {
                        return {
                            id: record.get("i.id"),
                            title: record.get("i.title"),
                            description: record.get("i.description"),
                            pic: record.get("i.pic"),
                            category: record.get("c.name")
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed searching for ideas. Please try again."
                });
                session.close();
            });
    };

    this.getSingle = function(req, res) {
        var session = this.driver.session();
        session
            .run("MATCH (c:Category)-[:CATEGORIZE]->(i:Idea)<-[m:MAKE]-(u:User) \
                WHERE i.id = {ideaId} \
                RETURN i, i.visibility, u.id, u.username, u.name, u.bio, \
                u.profilePic, c.name, m.lastChanged",
                { ideaId: req.params.id })
            .then(function(result) {
                res.send({
                    idea: result.records[0].get("i").properties,
                    author: {
                        id: result.records[0].get("u.id"),
                        name: result.records[0].get("u.name"),
                        email: result.records[0].get("u.username"),
                        bio: result.records[0].get("u.bio"),
                        profilePic: result.records[0].get("u.profilePic")
                    },
                    visibility: neo4jInt(result.records[0].get("i.visibility")).toNumber(),
                    category: result.records[0].get("c.name"),
                    timestamp: result.records[0].get("m.lastChanged")
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed finding idea. Please try again."
                });
                session.close();
            });
    };

    // helper function that will be called, in case update error occurs
    this._catchUpdateError = function(session, res) {
        res.send({
            message: "Update failed or author doesn't exist. Please try again."
        });
        session.close();
    };

    // helper function that only updates the idea's values
    this._updateIdeaValues = function(session, req, res, pic) {
        session
            .run("MATCH (i:Idea)<-[m:MAKE]-(:User) WHERE i.id = {ideaId} \
                SET \
                i.title = {title}, \
                i.description = {description}, \
                i.visibility = {visibility}, \
                i.background = {background}, \
                i.problem = {problem}, \
                i.solution = {solution}, \
                i.extraLink = {extraLink}, \
                i.pic = {pic}, \
                i.strengths = {strengths}, \
                i.weaknesses = {weaknesses}, \
                i.opportunities = {opportunities}, \
                i.threats = {threats}, \
                i.valueProposition = {valueProposition}, \
                i.customerSegments = {customerSegments}, \
                i.customerRelationships = {customerRelationships}, \
                i.channels = {channels}, \
                i.keyActivities = {keyActivities}, \
                i.keyResources = {keyResources}, \
                i.keyPartners = {keyPartners}, \
                i.costStructure = {costStructure}, \
                i.revenueStreams = {revenueStreams}, \
                m.lastChanged = {lastChanged}", 
                {
                    ideaId: req.body.id,
                    title: req.body.title,
                    description: req.body.description,
                    visibility: req.body.visibility,
                    background: req.body.background,
                    problem: req.body.problem,
                    solution: req.body.solution,
                    extraLink: req.body.extraLink,
                    pic: pic,
                    strengths: req.body.strengths,
                    weaknesses: req.body.weaknesses,
                    opportunities: req.body.opportunities,
                    threats: req.body.threats,
                    valueProposition: req.body.valueProposition,
                    customerSegments: req.body.customerSegments,
                    customerRelationships: req.body.customerRelationships,
                    channels: req.body.channels,
                    keyActivities: req.body.keyActivities,
                    keyResources: req.body.keyResources,
                    keyPartners: req.body.keyPartners,
                    costStructure: req.body.costStructure,
                    revenueStreams: req.body.revenueStreams,
                    lastChanged: (new Date()).getTime()
                })
            .then(function() {
                res.send({
                    message: "Successfully updated idea."
                });
                session.close();
            })
            .catch(function() {
                this._catchUpdateError(session, res);
            });
    };

    this._updateWithDifferentAuthor = function(session, that, req, res,
            pic, oldAuthor, newAuthor) {

        session
            .run("MATCH (u1:User)-[mOld:MAKE]->(i:Idea) \
                WHERE u1.username = {oldAuthor} \
                AND i.id = {ideaId} \
                WITH u1, mOld, mOld.createdAt AS createdAt, i \
                DELETE mOld \
                WITH i \
                MATCH (u2:User) WHERE u2.username = {newAuthor} \
                WITH i, u2 \
                CREATE (u2)-[mNew:MAKE \
                {createdAt: {lastChanged}, lastChanged: {lastChanged}}]->(i)",
                {
                    ideaId: req.body.id,
                    oldAuthor: oldAuthor,
                    newAuthor: newAuthor,
                    lastChanged: (new Date()).getTime()
                })
            .then(function() {
                that._updateIdeaValues(session, req, res, pic);
            })
            .catch(function(err) {
                that._catchUpdateError(session, res);
            });
    };

    this._updateWithDifferentCategory = function(session, that, req, res,
            pic, oldCategory, newCategory) {

        session
            .run("MATCH (i:Idea)<-[crOld:CATEGORIZE]-(c1:Category) \
                WHERE c1.name = {oldCategory} AND i.id = {ideaId} \
                WITH i, crOld, c1 \
                DELETE crOld \
                WITH i \
                MERGE (c2:Category {name: {newCategory}}) \
                CREATE (i)<-[crNew:CATEGORIZE]-(c2)", {
                    ideaId: req.body.id,
                    oldCategory: oldCategory,
                    newCategory: newCategory
                })
            .then(function() {
                that._updateIdeaValues(session, req, res, pic);
            })
            .catch(function(err) {
                that._catchUpdateError(session, res);
            });
    };

    this._updateWithDifferentBoth = function(session, that, req, res,
            pic, oldAuthor, newAuthor, oldCategory, newCategory) {

        session
            .run("MATCH (u1:User)-[mOld:MAKE]->(i:Idea)<-[\
                    crOld:CATEGORIZE]-(c1:Category) \
                    WHERE u1.username = {oldAuthor} AND \
                    i.id = {ideaId} AND c1.name = {oldCategory} \
                    WITH u1, mOld, i, crOld, c1 \
                    DELETE mOld, crOld \
                    WITH i \
                    MATCH (u2:User) WHERE u2.username = {newAuthor} \
                    WITH i, u2 \
                    MERGE (c2:Category {name: {newCategory}}) \
                    CREATE (u2)-[mNew:MAKE {createdAt: {lastChanged}, \
                        lastChanged: {lastChanged}}]->(i)<-[\
                        crNew:CATEGORIZE]-(c2)", 
                        {
                            ideaId: req.body.id,
                            oldAuthor: oldAuthor,
                            newAuthor: newAuthor,
                            oldCategory: oldCategory,
                            newCategory: newCategory,
                            lastChanged: (new Date()).getTime()
                        })
            .then(function() {
                // then update the idea
                that._updateIdeaValues(session, req, res, pic);
            })
            .catch(function(err) {
                that._catchUpdateError(session, res);
            });
    };

    this._checkDuplicateAndUpdate = function(session, that, req, res,
            pic, oldAuthor, newAuthor, oldCategory, newCategory) {

        session
            .run("MATCH (u:User) WHERE u.username = {newAuthor} RETURN u", 
                { newAuthor: req.body.author })
            .then(function(result) {
                // if author doesn't exist
                if (result.records.length === 0) {
                    that._catchUpdateError(session, res);
                } else {
                    // check whether the author and/or category are different or not
                    // then update their relationships, and then update the idea's
                    // inner values
                    if (oldAuthor !== newAuthor && 
                        oldCategory === newCategory) {

                        that._updateWithDifferentAuthor(
                            session, that, req, res, 
                            pic, oldAuthor, newAuthor);

                    } else if (oldAuthor === newAuthor && 
                        oldCategory !== newCategory) {

                        that._updateWithDifferentCategory(
                            session, that, req, res,
                            pic, oldCategory, newCategory);

                    } else if (oldAuthor !== newAuthor && 
                        oldCategory !== newCategory) {

                        that._updateWithDifferentBoth(
                            session, that, req, res,
                            pic, oldAuthor, newAuthor,
                            oldCategory, newCategory);

                    } else {
                        // just update the idea's values if the author and category
                        // are just the same
                        that._updateIdeaValues(session, req, res, pic);
                    }
                }
            })
            .catch(function(err) {
                that._catchUpdateError(session, res);
            });
    };

    this.update = function(req, res) {
        var session = this.driver.session();
        var that = this;

        var oldAuthor = req.body.oldAuthor;
        var newAuthor = req.body.author;
        var oldCategory = req.body.oldCategory;
        var newCategory = req.body.category;

        // find (and replace, if needed) idea picture first
        session
            .run("MATCH (i:Idea) WHERE i.id = {id} RETURN i.pic", {
                id: req.body.id
            })
            .then(function(result) {
                // assign the picture URL
                var pic = req.body.pic || result.records[0].get("i.pic");

                // next, check whether the new author exists, and then update the idea
                that._checkDuplicateAndUpdate(session, that, req, res,
                    pic, oldAuthor, newAuthor, oldCategory, newCategory);
            })
            .catch(function() {
                that._catchUpdateError(session, res);
            });

    };

    this.deleteIdeas = function(req, res) {
        var session = this.driver.session();
        var ids = req.body.ids;
        session
            .run("MATCH (i:Idea) WHERE i.id IN {ids} DETACH DELETE i", 
                {ids: ids})
            .then(function(result) {
                res.send({
                    message: "Successfully deleted idea(s)!"
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    message: "Failed deleting selected idea(s). Please try again."
                });
                session.close();
            });
    };

    this.getTotalIdeasCount = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (i:Idea) RETURN count(i)")
            .then(function(result) {
                res.send({
                    count: neo4jInt(result.records[0].get("count(i)")).toNumber()
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

    this.getTodayCount = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (i:Idea)<-[m:MAKE]-(:User) \
                WHERE m.lastChanged >= {today} \
                RETURN count(m)", 
                {
                    // exactly today's date, at 00:00
                    today: (new Date((new Date()).toDateString())).getTime()
                })
            .then(function(result) {
                res.send({
                    count: neo4jInt(result.records[0].get("count(m)")).toNumber()
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

    this.getIdeaListFromUser = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (u:User)-[m:MAKE]->(i:Idea)<-[cr:CATEGORIZE]-(c:Category) \
                WHERE u.id = {userId} \
                RETURN i.id, i.title, i.description, i.pic, c.name, \
                m.createdAt, m.lastChanged",
                {
                    userId: req.params.userId
                })
            .then(function(result) {
                res.send({
                    ideas: result.records.map(function(idea) {
                        return {
                            id: idea.get("i.id"),
                            title: idea.get("i.title"),
                            description: idea.get("i.description"),
                            pic: idea.get("i.pic"),
                            category: idea.get("c.name"),
                            timestamp: idea.get("m.lastChanged"),
                            type: idea.get("m.createdAt") === idea.get("m.lastChanged") ? "create" : "update",
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed loading list of ideas from user. Please try again."
                });
                session.close();
            });
    };

};

module.exports = IdeaSchema;