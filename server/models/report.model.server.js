var uuid = require("uuid");

var ReportSchema = function(dbDriver) {
    this.driver = dbDriver;

    this.create = function(req, res) {
        var session = this.driver.session();

        // author = the report's author
        // target = what is being reported (user or idea)
        session
            .run("MATCH (author:User), (target) WHERE \
                author.id = {authorId} AND target.id = {targetId} \
                RETURN author.id, target.id", 
                {
                    authorId: req.body.authorId,
                    targetId: req.body.targetId,
                })
            .then(function(result) {
                session
                    .run("MATCH (author:User), (target) WHERE \
                        author.id = {authorId} AND target.id = {targetId} \
                        CREATE (author)-[report:REPORT { \
                            id: {reportId}, \
                            message: {message}, \
                            reply: \"\", \
                            solved: false, \
                            createdAt: {createdAt} \
                        }]->(target)",
                        {
                            authorId: req.body.authorId,
                            targetId: req.body.targetId,
                            reportId: uuid.v4(),
                            message: req.body.message,
                            createdAt: (new Date()).getTime()
                        })
                    .then(function() {
                        res.send({
                            message: "Successfully created report."
                        });
                        session.close();
                    })
                    .catch(function(err) {
                        res.send({
                            message: "Failed creating report. Please try again, or send an email to lighthauzharbor@gmail.com to report."
                        });
                        session.close();
                    });
            })
            .catch(function(err) {
                res.send({
                    message: "Reported user / idea ID not found. Please send an email to lighthauzharbor@gmail.com about this error."
                });
                session.close();
            });
    };

    this.listReports = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (author:User)-[report:REPORT]->(target) \
                WHERE report.solved = false \
                RETURN author.username, report.id, report.message, report.createdAt \
                ORDER BY report.createdAt DESC")
            .then(function(result) {
                res.send({
                    reports: result.records.map(function(report) {
                        return {
                            id: report.get("report.id"),
                            message: report.get("report.message"),
                            author: report.get("author.username"),
                            createdAt: report.get("report.createdAt")
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed loading list of reports. Please try again."
                });
                session.close();
            });
    };

};

module.exports = ReportSchema;