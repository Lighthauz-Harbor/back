var ReportSchema = require("../models/report.model.server");

module.exports = function(router, dbDriver) {

    var reportSchema = new ReportSchema(dbDriver);

    router.post("/reports/create", function(req, res) {
        reportSchema.create(req, res);
    });

    router.get("/reports/list", function(req, res) {
        reportSchema.listReports(req, res);
    });

    router.get("/reports/get/:id", function(req, res) {
        reportSchema.getSingle(req, res);
    });

    router.put("/reports/reply/:id", function(req, res) {
        reportSchema.reply(req, res);
    });

};