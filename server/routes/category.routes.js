var CategorySchema = require("../models/category.model.server");

module.exports = function(router, dbDriver) {

    var categorySchema = new CategorySchema(dbDriver);

    router.get("/category/list", function(req, res) {
        categorySchema.listCategories(req, res);
    });

    router.post("/category/prefer", function(req, res) {
        categorySchema.setPreferredCategories(req, res);
    });

    router.post("/category/prefer/list", function(req, res) {
        categorySchema.listPreferredCategories(req, res);
    });

    router.post("/category/recommend/users", function(req, res) {
        categorySchema.recommendUsersByCategory(req, res);
    });

};
