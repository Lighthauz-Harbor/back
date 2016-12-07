var IdeaSchema = require("../models/idea.model.server");

module.exports = function(router, dbDriver) {

    var ideaSchema = new IdeaSchema(dbDriver);

    router.get("/ideas/list", function(req, res) {
        ideaSchema.listIdeas(req, res);
    });

    router.post("/ideas/create", function(req, res) {
        ideaSchema.create(req, res);
    });

    router.post("/ideas/invite-partners", function(req, res) {
        ideaSchema.invitePartners(req, res);
    });

    router.get("/ideas/collaborate/:ideaId/:partnerId", function(req, res) {
        ideaSchema.collaborateInIdea(req, res);
    });

    router.get("/ideas/partners/:ideaId", function(req, res) {
        ideaSchema.listPartners(req, res);
    });

    router.get("/ideas/get/:id", function(req, res) {
        ideaSchema.getSingle(req, res);
    });

    router.get("/ideas/search/:term", function(req, res) {
        ideaSchema.searchAsAdmin(req, res);
    });

    router.get("/ideas/search/title/:title", function(req, res) {
        ideaSchema.searchByTitle(req, res);
    });

    router.get("/ideas/search/category/:category", function(req, res) {
        ideaSchema.searchByCategory(req, res);
    });

    router.put("/ideas/update/:id", function(req, res) {
        ideaSchema.update(req, res);
    });

    router.post("/ideas/delete", function(req, res) {
        ideaSchema.deleteIdeas(req, res);
    });

    router.get("/ideas/total-ideas", function(req, res) {
        ideaSchema.getTotalIdeasCount(req, res);
    });

    router.get("/ideas/today/count", function(req, res) {
        ideaSchema.getTodayCount(req, res);
    });

    router.get("/ideas/list/:userId", function(req, res) {
        ideaSchema.getIdeaListFromUser(req, res);
    });

};