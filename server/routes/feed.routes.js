var neo4jInt = require("neo4j-driver").v1.int;

module.exports = function(router, dbDriver) {

    router.get("/news/:userId/:skip/:num", function(req, res) {
        var session = dbDriver.session();

        session
            .run("MATCH (you:User)-[:CONNECT]-(u:User)-[m:MAKE]->(i:Idea)<-[:CATEGORIZE]-(c:Category) \
                WHERE you.id = {userId} \
                RETURN u.id, u.name, u.profilePic, \
                i.id, i.pic, i.title, i.description, i.visibility, \
                c.name, m.lastChanged, m.createdAt \
                ORDER BY m.lastChanged DESC \
                SKIP {skip} LIMIT {num}",
                {
                    userId: req.params.userId,
                    skip: Number(req.params.skip),
                    num: Number(req.params.num)
                })
            .then(function(result) {
                res.send({
                    // post as in "a post of the news feed"
                    news: result.records.map(function(post) {
                        return {
                            author: {
                                id: post.get("u.id"),
                                name: post.get("u.name"),
                                pic: post.get("u.profilePic")
                            },
                            idea: {
                                id: post.get("i.id"),
                                pic: post.get("i.pic"),
                                title: post.get("i.title"),
                                description: post.get("i.description"),
                                category: post.get("c.name")
                            },
                            visibility: neo4jInt(post.get("i.visibility")).toNumber(),
                            type: post.get("m.createdAt") === post.get("m.lastChanged") ? "create" : "update",
                            timestamp: post.get("m.lastChanged")
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                console.log(err);
                res.send({
                    fail: "Failed fetching news feed. Please refresh."
                });
                session.close();
            });
    });

    router.post("/like", function(req, res) {
        var session = dbDriver.session();

        session
            .run("MATCH (u:User), (i:Idea) \
                WHERE u.id = {userId} AND i.id = {ideaId} \
                CREATE (u)-[:LIKE {lastChanged: {lastChanged}}]->(i)",
                {
                    userId: req.body.userId,
                    ideaId: req.body.ideaId,
                    lastChanged: (new Date()).getTime()
                })
            .then(function() {
                res.sendStatus(200);
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed to like this post. Please try again."
                });
                session.close();
            });
    });

    router.get("/like/list/:ideaId", function(req, res) {
        var session = dbDriver.session();

        session
            .run("MATCH (u:User)-[l:LIKE]->(i:Idea) \
                WHERE i.id = {ideaId} \
                RETURN u.id, u.name, u.profilePic \
                ORDER BY l.lastChanged DESC",
                { ideaId: req.params.ideaId })
            .then(function(result) {
                res.send({
                    list: result.records.map(function(user) {
                        return {
                            id: user.get("u.id"),
                            name: user.get("u.name"),
                            profilePic: user.get("u.profilePic")
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed fetching list of likers. Please try again."
                });
                session.close();
            });
    });

    router.post("/unlike", function(req, res) {
        var session = dbDriver.session();

        session
            .run("MATCH (u:User)-[l:LIKE]->(i:Idea) \
                WHERE u.id = {userId} AND i.id = {ideaId} \
                DELETE l",
                {
                    userId: req.body.userId,
                    ideaId: req.body.ideaId
                })
            .then(function() {
                res.sendStatus(200);
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed to unlike this post. Please try again."
                });
                session.close();
            });
    });

    router.post("/comment", function(req, res) {
        var session = dbDriver.session();

        session
            .run("MATCH (u:User), (i:Idea) \
                WHERE u.id = {userId} AND i.id = {ideaId} \
                CREATE (u)-[:COMMENT {comment: {comment}, \
                lastChanged: {lastChanged}}]->(i)",
                {
                    userId: req.body.userId,
                    ideaId: req.body.ideaId,
                    comment: req.body.comment,
                    lastChanged: (new Date()).getTime()
                })
            .then(function() {
                res.sendStatus(200);
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed commenting this post. Please try again."
                });
                session.close();
            });
    });

    router.get("/comment/list/:ideaId", function(req, res) {
        var session = dbDriver.session();

        session
            .run("MATCH (u:User)-[c:COMMENT]->(i:Idea) \
                WHERE i.id = {ideaId} \
                RETURN u.id, u.name, u.profilePic, c.comment, c.lastChanged",
                { ideaId: req.params.ideaId })
            .then(function(result) {
                res.send({
                    list: result.records.map(function(item) {
                        return {
                            author: {
                                id: item.get("u.id"),
                                name: item.get("u.name"),
                                profilePic: item.get("u.profilePic")
                            },
                            comment: {
                                text: item.get("c.comment"),
                                timestamp: item.get("c.lastChanged")
                            }
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed fetching list of comments. Please try again."
                });
                session.close();
            });
    });

};