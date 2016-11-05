var LocalStrategy = require("passport-local").Strategy;

var UserSchema = require("../models/user.model.server");

module.exports = function(app, router, dbDriver, 
                          passport, authMid, adminMid) {

    passport.use(new LocalStrategy(
        function(username, password, done) {

            var session = dbDriver.session();

            /*User.findOne({ "local.username": username }, function(err, user) {
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
            });*/
        }
    ));

    /*passport.serializeUser(function(user, done) {
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
    );*/

    router.post("/admin/auth/signup", function(req, res, next) {
        var userSchema = new UserSchema(dbDriver);
        userSchema.create(req, res);
    });

    /*router.post("/admin/auth/logout", function(req, res) {
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
    });*/
};