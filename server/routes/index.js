var path = require("path");
var rootDir = path.resolve(__dirname, "..", "..");

var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
    res.sendfile(path.resolve(rootDir, "dist", "index.html"));
});

module.exports = router;