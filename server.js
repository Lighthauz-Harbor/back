var express = require("express");
var passport = require("passport");
var logger = require("morgan");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var session = require("express-session");
var flash = require("flash");

var path = require("path");

var routes = require("./server/routes/routes");

/**
 * Neo4j configuration
 */
var neo4j = require("neo4j-driver").v1;
var dbDriver = neo4j.driver("bolt://localhost", 
    neo4j.auth.basic("neo4j", "neo4j"));

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

app.use(session({
    secret: "i am a keyboard cat",
    resave: true,
    saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

routes(app, dbDriver, passport);

var host = "localhost";
var PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function() {
    console.log("Server is listening at http://" + host + ":" + PORT);
});