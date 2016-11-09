var jwt = require("jsonwebtoken");
var LocalStrategy = require("passport-local").Strategy;

var UserSchema = require("../models/user.model.server");

module.exports = function(router, dbDriver, 
                          passport, adminMiddleware) {

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

    router.get("/loggedIn", function(req, res) {
        res.send(req.isAuthenticated() ? req.user : "0");
    });

    router.get("/fail", function(req, res) {
        req.logOut();
        res.json({
            fail: "Cannot login: invalid username/password."
        });
    });

    router.post("/login", 
        passport.authenticate("local", {
            failureRedirect: "/admin/auth/fail"
        }),
        adminMiddleware,
        function(req, res) {
            res.send({
                username: req.user.username,
                token: jwt.sign(req.user, "i am a keyboard cat")
            });
        }
    );

    router.post("/signup", function(req, res, next) {
        userSchema.create(req, res);
    });

    router.get("/getUser/:username", function(req, res) {
        userSchema.find(req, res);
    });

    router.post("/logout", function(req, res) {
        req.logOut();

        res.sendStatus(204);
    });

};