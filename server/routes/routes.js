var adminAuthRoutes = require("./admin-auth.routes");
var usersRoutes = require("./users.routes");
var ideasRoutes = require("./ideas.routes");
var reportsRoutes = require("./reports.routes");

var path = require("path");
var rootDir = path.resolve(__dirname, "..", "..");

module.exports = function(app, router, dbDriver, passport) {

    var authMid = function(req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    };

    var adminMid = function(req, res, next) {
        if (!req.isAuthenticated() || req.user.role !== "admin") {
            res.send(401);
        } else {
            next();
        }
    };

    adminAuthRoutes(app, router, dbDriver, 
        passport, authMid, adminMid);

    app.use("/", router);

    // in case the current route does not match any of the above
    router.get("*", function(req, res) {
        res.sendFile(path.resolve(rootDir, "dist", "index.html"));
    });
};