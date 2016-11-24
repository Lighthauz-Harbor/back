var uuid = require("uuid");
var nodemailer = require("nodemailer");

var smtpConfig = require("../config/smtp");

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
                            title: {title}, \
                            message: {message}, \
                            reply: \"\", \
                            solved: false, \
                            createdAt: {createdAt} \
                        }]->(target)",
                        {
                            authorId: req.body.authorId,
                            targetId: req.body.targetId,
                            reportId: uuid.v4(),
                            title: req.body.title,
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
                RETURN author.username, report.id, \
                report.title, report.createdAt \
                ORDER BY report.createdAt DESC")
            .then(function(result) {
                res.send({
                    reports: result.records.map(function(report) {
                        return {
                            id: report.get("report.id"),
                            title: report.get("report.title"),
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

    this.getRecent = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (author:User)-[report:REPORT]->(target) \
                WHERE report.solved = false \
                RETURN author.username, report.id, \
                report.title, report.createdAt \
                ORDER BY report.createdAt DESC LIMIT 4")
            .then(function(result) {
                res.send({
                    reports: result.records.map(function(report) {
                        return {
                            id: report.get("report.id"),
                            title: report.get("report.title"),
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

    this.getSingle = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (author:User)-[report:REPORT]->(target) \
                WHERE report.id = {id} \
                RETURN report.title, author.username, \
                toString(labels(target)[0]), report.message, \
                report.reply, report.solved, report.createdAt",
                {
                    id: req.params.id
                })
            .then(function(result) {
                res.send({
                    title: result.records[0].get("report.title"),
                    author: result.records[0].get("author.username"),
                    type: result.records[0].get("toString(labels(target)[0])"),
                    message: result.records[0].get("report.message"),
                    reply: result.records[0].get("report.reply"),
                    solved: result.records[0].get("report.solved"),
                    createdAt: result.records[0].get("report.createdAt")
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed loading report. Please try again."
                });
                session.close();
            });
    };

    this.reply = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (author:User)-[report:REPORT]->(target) \
                WHERE report.id = {id} \
                SET report.reply = {reply}, \
                report.solved = {solved} \
                RETURN author.name, author.username, report.message", 
                {
                    id: req.params.id,
                    reply: req.body.reply,
                    solved: req.body.solved
                })
            .then(function(result) {
                var authorName = result.records[0].get("author.name");
                var authorEmail = result.records[0].get("author.username");
                var message = result.records[0].get("report.message");

                var transporter = nodemailer.createTransport(smtpConfig);

                var replyText = "Dear " + authorName + ",\n\n" +
                    "In response to your following report:\n\n" +
                    '"' + message + '"\n\n' +
                    "Here's what our administrator informs, regarding what they have done to help you:\n\n" +
                    '"' + req.body.reply + '"\n\n' +
                    (req.body.solved ? "Therefore, your problem is all cleared." :
                        "We apologize that we cannot solve your problem now.") + "\n\n" +
                    "That is all from us. We hope you may understand. Thank you for your attention.\n\n" +
                    "Regards,\n\nLighthauz Harbor team.";

                var mailOptions = {
                    from: '"Lighthauz Harbor" <' + process.env.EMAIL_ADDR + '>',
                    to: authorEmail,
                    subject: "Response to your previous report",
                    text: replyText
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                        res.send({
                            message: "Failed sending reply to user's email (your reply has been stored). Please try again."
                        });
                        session.close();
                    } else {
                        console.log("Message sent: " + info.response);
                        res.send({
                            message: "Reply successfully sent to user's email!"
                        });
                        session.close();
                    }
                });
            })
            .catch(function(err) {
                res.send({
                    message: "Failed storing reply to user in our database. Please try again."
                });
            });
    };

};

module.exports = ReportSchema;