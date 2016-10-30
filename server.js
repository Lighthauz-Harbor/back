var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");

var index = require("./server/routes/index");
var users = require("./server/routes/users");
var ideas = require("./server/routes/ideas");
var reports = require("./server/routes/reports");

var app = express();

app.use(logger("dev"));
app.use(bodyParser.json());

app.use("/", index);

var PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function() {
    var host = "localhost";
    console.log("Server is listening at http://" + host + ":" + PORT);
});
