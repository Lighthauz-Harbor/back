var uuid = require("uuid");

var IdeaSchema = function(dbDriver) {
    this.driver = dbDriver;

    this.listIdeas = function(req, res) {
        var session = this.driver.session();
        // m.timestamp: "modified at", i.createdAt: "created at"
        session
            .run("MATCH (i:Idea)<-[m:MAKE]-(u:User) RETURN \
                i.title AS title, i.description AS description, \
                u.username AS author, m.timestamp AS modifiedAt, \
                i.createdAt AS createdAt ORDER BY i.createdAt DESC")
            .then(function(result) {
                res.send({
                    results: result.records
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