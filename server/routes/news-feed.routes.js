module.exports = function(router, dbDriver) {

    router.get("/news/:skip/:num", function(req, res) {
        var session = dbDriver.session();

        session
            .run("MATCH (u:User)-[m:MAKE]->(i:Idea)<-[:CATEGORIZE]-(c:Category) \
                RETURN u.id, u.name, u.profilePic, \
                i.id, i.pic, i.title, i.description, \
                c.name, m.lastChanged, m.createdAt \
                ORDER BY m.lastChanged DESC \
                SKIP {skip} LIMIT {num}",
                {
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

};