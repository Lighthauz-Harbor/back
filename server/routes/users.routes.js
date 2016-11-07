var UserSchema = require("../models/user.model.server");

module.exports = function(router, dbDriver, passport, authMiddleware) {

    var userSchema = new UserSchema(dbDriver);

    router.post("/create", function(req, res) {

    });

};