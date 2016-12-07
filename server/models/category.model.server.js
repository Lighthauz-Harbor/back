module.exports = function(dbDriver) {

    this.driver = dbDriver;

    this.listCategories = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (c:Category) RETURN c.name")
            .then(function(result) {
                res.send({
                    list: result.records.map(function(category) {
                        return category.get("c.name");
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed loading list of categories. Please try again."
                });
                session.close();
            });

    };

    this.setPreferredCategories = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (u:User), (c:Category) \
                WHERE u.id = {userId} AND c.name IN {categories} \
                CREATE (u)-[:PREFER]->(c)",
                {
                    userId: req.body.userId,
                    categories: req.body.categories, // in array of strings
                })
            .then(function() {
                res.sendStatus(200);
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed setting user's preferred categories. Please try again."
                });
                session.close();
            });
    };

    this.listPreferredCategories = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (u:User)-[:PREFER]->(c:Category) \
                WHERE u.id = {userId} RETURN c.name",
                {
                    userId: req.body.userId
                })
            .then(function(result) {
                res.send({
                    list: result.records.map(function(category) {
                        return category.get("c.name");
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed loading list of preferred categories. Please try again."
                });
                session.close();
            });
    };

    this.recommendUsersByCategory = function(req, res) {
        var session = this.driver.session();

        session
            .run("MATCH (u:User)-[:PREFER]->(c:Category) \
                WHERE c.name = {category} \
                RETURN u.id, u.name, u.username, u.bio, u.profilePic \
                LIMIT {num}",
                {
                    category: req.body.category,
                    num: req.body.num
                })
            .then(function(result) {
                res.send({
                    recommended: result.records.map(function(user) {
                        return {
                            id: user.get("u.id"),
                            name: user.get("u.name"),
                            username: user.get("u.username"),
                            bio: user.get("u.bio"),
                            profilePic: user.get("u.profilePic")
                        };
                    })
                });
                session.close();
            })
            .catch(function(err) {
                res.send({
                    fail: "Failed to find recommended partners. Trying again."
                });
                session.close();
            });
    };

};
