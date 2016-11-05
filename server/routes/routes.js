var adminAuthRoutes = require("./admin-auth.routes");
var usersRoutes = require("./users.routes");
var ideasRoutes = require("./ideas.routes");
var reportsRoutes = require("./reports.routes");

var path = require("path");
var rootDir = path.resolve(__dirname, "..", "..");

module.exports = function(app, router, dbDriver, passport) {

    // Authentication middleware for user login
    var authMid = function(req, res, next) {
        if (!req.isAuthenticated()) {
            req.logOut();
            res.json({
                fail: "Unauthenticated user. Please log in again."
            });
        } else {
            next();
        }
    };

    // Authentication middleware for admin login
    var adminMid = function(req, res, next) {
        if (!req.isAuthenticated() || req.user.role !== "admin") {
            req.logOut();
            res.json({
                fail: "Unauthorized user. Only admins are allowed to log in."
            }); 
        } else {
            next();
        }
    };

    // Assign routes to app and router
    adminAuthRoutes(app, router, dbDriver, passport, adminMid);
    app.use("/", router);

    // Fallback route (other route handling is handled in Angular 2)
    router.get("*", function(req, res) {
        res.sendFile(path.resolve(rootDir, "dist", "index.html"));
    });
};