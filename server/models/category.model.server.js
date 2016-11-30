module.exports = function(dbDriver) {

    this.driver = dbDriver;

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

};