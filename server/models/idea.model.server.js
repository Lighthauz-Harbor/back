var uuid = require("uuid");

var IdeaSchema = function(dbDriver) {
    this.driver = dbDriver;

    this.create = function(req, res) {
        var session = this.driver.session();

        // match the author's username with an existing one
        var matchQuery = "MATCH (u: User) WHERE u.username = {author} RETURN u.id";

        // then check for existing category (or make a new one, 
        // if it doesn't exist)
        var createQuery = "MATCH (u: User) WHERE u.id = {authorId} \
            MERGE (c: Category {id: {categoryId}, name: {categoryName}}) \
            CREATE (u)-[m:MAKE {timestamp: {createdAt}}]->(i:Idea \
                { \
                    id: {ideaId}, \
                    title: {title}, \
                    description: {description}, \
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
                        categoryId: uuid.v4(),
                        categoryName: req.body.category,
                        createdAt: (new Date()).getTime(),
                        ideaId: uuid.v4(),
                        title: req.body.title,
                        description: req.body.description,
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
        // m.timestamp: "modified at", i.createdAt: "created at"
        session
            .run("MATCH (i:Idea)<-[m:MAKE]-(u:User) RETURN \
                i.id, i.title, i.description, u.username, m.timestamp \
                ORDER BY m.timestamp DESC")
            .then(function(result) {
                res.send({
                    results: result.records.map(function(record) {
                        var id = record.get("i.id");
                        var title = record.get("i.title");
                        var description = record.get("i.description");
                        var author = record.get("u.username");
                        var modifiedAt = (new Date(record.get("m.timestamp"))).toDateString();

                        return {
                            id: id,
                            title: title,
                            description: description,
                            author: author,
                            modifiedAt: modifiedAt,
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
};

module.exports = IdeaSchema;