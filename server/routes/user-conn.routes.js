var UserSchema = require("../models/user.model.server");

module.exports = function(router, dbDriver) {

    var userSchema = new UserSchema(dbDriver);

    router.get("/connections/:userId/:status", function(req, res) {
        userSchema.getConnections(req, res);
    });

    router.get("/connections/is-connected/:user1/:user2", function(req, res) {
        userSchema.isConnected(req, res);
    });

    router.post("/connections/request", function(req, res) {
        userSchema.sendConnectionRequest(req, res);
    });

    router.put("/connections/accept", function(req, res) {
        userSchema.acceptRequest(req, res);
    });

    router.put("/connections/reject", function(req, res) {
        userSchema.rejectRequest(req, res);
    });

    router.post("/connections/remove", function(req, res) {
        userSchema.removeConnection(req, res);
    });

};