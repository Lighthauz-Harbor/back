var UserSchema = require("../models/user.model.server");

module.exports = function(router, dbDriver) {

    var userSchema = new UserSchema(dbDriver);

    router.get("/connections/:userId", function(req, res) {
        userSchema.getConnections(req, res);
    });

    router.get("/connections/requests/sent/:userId", function(req, res) {
        userSchema.getSentConnectionRequests(req, res);
    });

    router.get("/connections/requests/received/:userId", function(req, res) {
        userSchema.getReceivedConnectionRequests(req, res);
    });

    router.get("/connections/is-connected/:user1/:user2", function(req, res) {
        userSchema.isConnected(req, res);
    });

    router.post("/connections/request", function(req, res) {
        userSchema.sendConnectionRequest(req, res);
    });

    router.post("/connections/accept", function(req, res) {
        userSchema.acceptRequest(req, res);
    });

    router.post("/connections/remove", function(req, res) {
        userSchema.removeConnectionOrRequest(req, res);
    });

};