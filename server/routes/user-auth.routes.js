var jwt = require("jsonwebtoken");
var LocalStrategy = require("passport-local").Strategy;

var UserSchema = require("../models/user.model.server");

module.exports = function(router, dbDriver,
                          passport, authMiddleware) {

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
            failureRedirect: "/user/auth/fail"
        }),
        authMiddleware,
        function(req, res) {
            res.send({
                id: req.user.id,
                username: req.user.username,
                token: jwt.sign(req.user, "i am a keyboard cat")
            });
        });

    router.post("/logout", function(req, res) {
        req.logOut();

        res.sendStatus(204);
    });

    router.put("/generate-verif", function(req, res) {
        userSchema.generateVerifCode(req, res);
    });

    router.get("/verify/:username/:code", function(req, res) {
        userSchema.verifyAccount(req, res);
    });

    router.get("/is-verified/:username", function(req, res) {
        userSchema.isVerified(req, res);
    });

};
