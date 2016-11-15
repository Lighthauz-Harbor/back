var IdeaSchema = require("../models/idea.model.server");

module.exports = function(router, dbDriver) {

    var ideaSchema = new IdeaSchema(dbDriver);

    router.get("/ideas/list", function(req, res) {
        ideaSchema.listIdeas(req, res);
    });

    router.post("/ideas/create", function(req, res) {
        ideaSchema.create(req, res);
    });

    router.get("/ideas/get/:id", function(req, res) {
        ideaSchema.getSingle(req, res);
    });

    router.get("/ideas/search/:term", function(req, res) {
        ideaSchema.search(req, res);
    });

    router.put("/ideas/update/:id", function(req, res) {
        ideaSchema.update(req, res);
    });

    router.post("/ideas/delete", function(req, res) {
        ideaSchema.deleteIdeas(req, res);
    });

};