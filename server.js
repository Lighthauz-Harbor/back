var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var logger = require("morgan");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var session = require("express-session");

var path = require("path");

var routes = require("./server/routes/routes");

/**
 * Mongoose/MongoDB
 */
var MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/lighthauz";
mongoose.connect(MONGO_URI);

/**
 * Express
 */
var app = express();

app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("X-HTTP-Method-Override"));

app.use(express.static(path.resolve(__dirname, "dist")));

/**
 * Sessions + Passport
 */
app.use(session({
    secret: "i am a keyboard cat",
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

var router = express.Router();
routes(app, router, passport);

var host = "localhost";
var PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function() {
    console.log("Server is listening at http://" + host + ":" + PORT);
});
