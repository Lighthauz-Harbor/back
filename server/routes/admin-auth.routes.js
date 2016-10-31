var User = require("../models/user.model.server");
var ObjectId = require("mongoose").Types.ObjectId;

var LocalStrategy = require("passport-local").Strategy;

module.exports = function(app, router, passport, authMid, adminMid) {

    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ "local.username": username }, function(err, user) {
                if (err) return done(err);
                if (!user) {
                    return done(null, false, { message: "Incorrect username." });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: "Incorrect password." });
                }
                if (user.role !== "admin") {
                    return done(null, false, { message: "Unauthorized user!" });
                }
                return done(null, user);
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ "_id": id }, function(err, user) {
            done(err, user);
        });
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
        function(req, res) {
            res.send(req.user);
        }
    );

    router.post("/admin/auth/signup", function(req, res, next) {
        if (!req.body.local || 
            !req.body.local.username || 
            !req.body.local.password || 
            !req.body.role) {
            res.sendStatus(400);
        } else {
            var username = req.body.local.username;

            User.findOne({ username: username }, function(err, doc) {
                if (err) return next(err);

                if (doc) {
                    return res.send("Username has been taken!");
                }
            });

            var role = req.body.role;
            var user = new User({
                local: {
                    username: username
                },
                role: role
            });

            user.local.password = user.generateHash(req.body.local.password);

            user.save(function(err, doc) {
                if (err) { // error saving the user
                    console.error("Error saving user", err);
                    res.sendStatus(501);
                } else { // successful creating the user
                    res.sendStatus(201);
                }
            });
        }
    });

    router.post("/admin/auth/logout", function(req, res) {
        req.logOut();

        res.sendStatus(204);
    });

    router.get("/admin/auth/user", authMid, function(req, res) {
        res.json(req.user);
    });

    router.delete("/admin/auth/delete/:uid", adminMid, function(req, res) {
        User.remove({
            $or: [
                { "local.username": req.params.uid },
                { "_id": ObjectId(req.params.uid) }
            ]
        }, function(err) {
            if (err) return next(err);

            res.sendStatus(204);
        });
    });
};