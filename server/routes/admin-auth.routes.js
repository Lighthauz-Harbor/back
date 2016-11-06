var LocalStrategy = require("passport-local").Strategy;

var UserSchema = require("../models/user.model.server");

module.exports = function(app, router, dbDriver, 
                          passport, adminMid) {

    var userSchema = new UserSchema(dbDriver);

    passport.use(new LocalStrategy(function(username, password, done) {
        userSchema.strategy(username, password, done);
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        userSchema.deserialize(id, done);
    });

    router.get("/admin/auth/loggedIn", function(req, res) {
        res.send(req.isAuthenticated() ? req.user : "0");
    });

    router.get("/admin/auth/fail", function(req, res) {
        req.logOut();
        res.json({
            fail: "Cannot login: invalid username/password."
        });
    });

    router.post("/admin/auth/login", 
        passport.authenticate("local", {
            failureRedirect: "/admin/auth/fail"
        }),
        adminMid,
        function(req, res) {
            res.send(req.user);
        }
    );

    router.post("/admin/auth/signup", function(req, res, next) {
        userSchema.create(req, res);
    });

    router.get("/admin/auth/getUser/:username", function(req, res) {
        userSchema.find(req, res);
    });

    router.post("/admin/auth/logout", function(req, res) {
        req.logOut();

        res.sendStatus(204);
    });
};