var bcrypt = require("bcrypt-nodejs");

var UserSchema = function(dbDriver) {
    this.driver = dbDriver;

    this._generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    };

    this._comparePassword = function(password, hash) {
        return bcrypt.compareSync(password, hash);
    };

    this._checkParams = function(params) {
        if (!params.role || !params.name ||
            !params.username || !params.password) {

            return false;
        }

        if (typeof params.role !== "string" ||
            typeof params.name !== "string" ||
            typeof params.username !== "string" ||
            typeof params.password !== "string") {

            return false;
        }

        return true;
    };

    this.create = function(req, res) {
        if (!this._checkParams(req.body)) {
            res.status(400).send("Wrong parameters: please check the request.");
        }

        var params = {
            name: req.body.name,
            username: req.body.username,
            role: req.body.role,
            password: this._generateHash(req.body.password),
        };

        var session = this.driver.session();

        session
            .run("MATCH (u:User) WHERE u.username = {username} RETURN u", 
                {username: params.username})
            .then(function(result) {
                if (result.records.length > 0) {
                    res.status(501).send("Duplicate user!");
                } else {
                    session
                        .run(
                            "CREATE (:User {username: {username}, password: {password}," +
                            "name: {name}, role: {role}})", params)
                        .then(function() {
                            res.status(201).send("User successfully created!");
                            session.close();
                        })
                        .catch(function(err) {
                            res.status(501).send("Failed creating user!");
                            session.close();
                        });
                }
            })
            .catch(function(err) {
                res.status(501).send("Error finding user availability!");
                session.close();
            });
    };

    this.strategy = function(username, password, done) {
        var session = this.driver.session();
        var that = this;

        session
            .run("MATCH (u:User) WHERE u.username = {username} RETURN u", 
                {username: username})
            .then(function(result) {
                if (result.records.length === 0) {
                    return done(null, false, { message: "Incorrect username." });
                }

                var user = result.records[0].get(0).properties;
                if (!that._comparePassword(password, user.password)) {
                    return done(null, false, { message: "Incorrect password." });
                }
                return done(null, user);
            })
            .catch(function(err) {
                return done(err);
            });
    };

    this.deserialize = function(id, done) {
        var session = this.driver.session();
        session
            .run("MATCH (u:User) WHERE u.username = {username} RETURN u", 
                {username: id})
            .then(function(result) {
                var user = result.records[0].get(0).properties;
                done(null, user);
                session.close();
            })
            .catch(function(err) {
                done(err, false);
                session.close();
            });
    };

    /*this.adminStrategy = function(username, password, done) {
        var session = this.driver.session();

        session
            .run("MATCH (u:User) WHERE u.username = {username} RETURN u", 
                {username: username})
            .then(function(result) {
                var user = result.records[0].get(0).properties;
                if (result.records.length === 0) {
                    return done(null, false, { message: "Incorrect username." });
                } else if (!this._comparePassword(password, user.password)) {
                    return done(null, false, { message: "Incorrect password." });
                } else if (user.role !== "admin") {
                    return done(null, false, { message: "Unauthorized user!" });
                }
                return done(null, user);
            })
            .catch(function(err) {
                return done(err);
            });
    };*/

    this.find = function(req, res) {
        var session = this.driver.session();
        console.log(req.params.username);
        session
            .run("MATCH (u:User) WHERE u.username = {username} RETURN u", 
                {username: req.params.username})
            .then(function(result) {
                var user = result.records[0].get(0).properties;
                res.send(user);
                session.close();
            })
            .catch(function(err) {
                res.send(err);
                session.close();
            });
    };
};

module.exports = UserSchema;

/*var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var userSchema = mongoose.Schema({
    local: {
        username: {
            type: String,
            unique: true
        },
        password: String
    },
    role: {
        type: String
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model("User", userSchema);*/