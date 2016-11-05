var bcrypt = require("bcrypt-nodejs");

var UserSchema = function(dbDriver) {
    this.driver = dbDriver;

    this._generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    };

    this._checkParams = function(params) {
        if (!params.role || !params.name ||
            !params.email || !params.password) {

            return false;
        }

        if (typeof params.role !== "string" ||
            typeof params.name !== "string" ||
            typeof params.email !== "string" ||
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
            email: req.body.email,
            role: req.body.role,
            password: this._generateHash(req.body.password),
        };

        var session = this.driver.session();

        session
            .run("MATCH (u:User) WHERE u.email = {email} RETURN u", 
                {email: params.email})
            .then(function(result) {
                if (result.records.length > 0) {
                    res.status(501).send("Duplicate user!");
                } else {
                    session
                        .run(
                            "CREATE (:User {email: {email}, password: {password}," +
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