var CategorySchema = require("../models/category.model.server");

module.exports = function(router, dbDriver) {

    var categorySchema = new CategorySchema(dbDriver);

    router.post("/category/prefer", function(req, res) {
        categorySchema.setPreferredCategories(req, res);
    });

};