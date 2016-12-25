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

    // Middleware to prevent deactivated users from logging in
    var blockMiddleware = function(req, res, next) {
        if (req.user.blocked) {
            req.logOut();
            res.json({
                fail: "Your account has been deactivated. You may not log in."
            });
        } else {
            next();
        }
    };

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
        blockMiddleware,
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

    router.get("/is-blocked/:id", function(req, res) {
        userSchema.isBlocked(req, res);
    });

    router.post("/deactivate", function(req, res) {
        userSchema.deactivateUser(req, res);
    });

    router.post("/reactivate", function(req, res) {
        userSchema.reactivateUser(req, res);
    });

};
