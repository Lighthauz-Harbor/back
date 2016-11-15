var uuid = require("uuid");
var neo4jInt = require("neo4j-driver").v1.int;

var IdeaSchema = function(dbDriver) {
    this.driver = dbDriver;

    this.create = function(req, res) {
        var session = this.driver.session();

        // match the author's username with an existing one
        var matchQuery = "MATCH (u: User) WHERE u.username = {author} RETURN u.id";

        // then check for existing category (or make a new one, 
        // if it doesn't exist)
        var createQuery = "MATCH (u: User) WHERE u.id = {authorId} \
            MERGE (c: Category {name: {categoryName}}) \
            CREATE (u)-[m:MAKE {lastChanged: {createdAt}}]->(i:Idea \
                { \
                    id: {ideaId}, \
                    title: {title}, \
                    description: {description}, \
                    visibility: {visibility}, \
                    background: {background}, \
                    problem: {problem}, \
                    solution: {solution}, \
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
                            message: "Succesfully created idea."
                        });
                        session.close();
                    })
                    .catch(function(err) {
                        res.send({
                            message: "Error creating idea. Please try again."
                        });
                        session.close();
                    });
            })
            .catch(function(err) {
                res.send({
                    message: "User/author doesn't exist. Please try again."
                });
                session.close();
            });
    };

    this.listIdeas = function(req, res) {
        var session = this.driver.session();
        // m.lastChanged: "modified at", i.createdAt: "created at"
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

    this.search = function(req, res) {
        var titleRegex = "(?i).*" + req.params.term + ".*";
        var session = this.driver.session();
        session
            .run("MATCH (i:Idea)<-[m:MAKE]-(u:User) \
                WHERE i.title =~ {titleRegex} \
                RETURN i, m.lastChanged, u.username ORDER BY i.title ASC",
                { titleRegex: titleRegex })
            .then(function(result) {
                res.send({
                    results: result.records.map(function(record) {
                        var idea = record.get("i").properties;
                        return {
                            id: idea.id,
                            title: idea.title,
                            description: idea.description,
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
};

module.exports = IdeaSchema;