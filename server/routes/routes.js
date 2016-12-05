var express = require("express");

var userAuthRoutes = require("./user-auth.routes");
var adminAuthRoutes = require("./admin-auth.routes");

var usersRoutes = require("./users.routes");
var ideasRoutes = require("./ideas.routes");
var reportsRoutes = require("./reports.routes");

var feedRoutes = require("./feed.routes"); // feed = news feed and user profile
var userConnRoutes = require("./user-conn.routes");
var categoryRoutes = require("./category.routes");
var recommenderRoutes = require("./recommender.routes");

var path = require("path");
var rootDir = path.resolve(__dirname, "..", "..");

module.exports = function(app, dbDriver, passport) {

    // Authentication middleware for user login
    var authMiddleware = function(req, res, next) {
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
    var adminMiddleware = function(req, res, next) {
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
    var adminAuthRouter = express.Router();
    var userAuthRouter = express.Router();
    adminAuthRoutes(adminAuthRouter, dbDriver, passport, adminMiddleware);
    userAuthRoutes(userAuthRouter, dbDriver, passport, authMiddleware);

    var apiRouter = express.Router();

    // for admin interface
    usersRoutes(apiRouter, dbDriver);
    ideasRoutes(apiRouter, dbDriver); // also for Android app
    reportsRoutes(apiRouter, dbDriver);

    // for user application
    feedRoutes(apiRouter, dbDriver);
    userConnRoutes(apiRouter, dbDriver);
    categoryRoutes(apiRouter, dbDriver);
    recommenderRoutes(apiRouter, dbDriver);

    app.use("/admin/auth", adminAuthRouter);
    app.use("/user/auth", userAuthRouter);
    app.use("/api", apiRouter);

    // Fallback route (other route handling is handled in Angular 2)
    app.get("*", function(req, res) {
        res.sendFile(path.resolve(rootDir, "dist", "index.html"));
    });
};