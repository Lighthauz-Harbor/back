var UserSchema = require("../models/user.model.server");

module.exports = function(router, dbDriver, passport, authMiddleware) {

    var userSchema = new UserSchema(dbDriver);

    router.get("/users/search/:term", function(req, res) {
        userSchema.search(req, res);
    });

    router.post("/users/create", function(req, res) {
        userSchema.create(req, res);
    });

    router.get("/users/list", function(req, res) {
        userSchema.listUsers(req, res);
    });

    router.post("/users/delete", function(req, res) {
        userSchema.deleteUsers(req, res);
    });

};