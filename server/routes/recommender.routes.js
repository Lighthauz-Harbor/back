module.exports = function(router, dbDriver) {

    var _processPartnersQuery = "MATCH (them:User) WHERE them.role = 'user' \
        WITH them.id AS ids SKIP {randomOffset} LIMIT 8 \
        WITH filter(i IN collect(ids) WHERE i <> {myId}) AS themIds \
        UNWIND themIds AS tid \
        MERGE (s:RecommenderSource {id: {myId}}) \
        WITH s, tid \
        MERGE (s)-[w:TO_PARTNER_WITH]->(d:RecommenderDestination {id: tid}) \
        WITH s, w, d, tid \
        MATCH (me:User {id: {myId}}) \
        MATCH (them:User {id: tid}) \
        OPTIONAL MATCH (me:User)-[l1:LIKE]->(:Idea)<-[:CATEGORIZE]-(c:Category) \
        OPTIONAL MATCH (them:User)-[l2:LIKE]->(:Idea)<-[:CATEGORIZE]-(c) \
        WITH s, w, d, c.name AS category, \
        count(DISTINCT l1) AS myLikes, count(DISTINCT l2) AS theirLikes \
        ORDER BY category \
        WITH s, w, d, \
        toFloat(sum(myLikes)) AS sum1, \
        toFloat(sum(theirLikes)) AS sum2,  \
        toFloat(count(category)) AS num, \
        toFloat(sum(myLikes * myLikes)) AS sqSum1,  \
        toFloat(sum(theirLikes * theirLikes)) AS sqSum2, \
        toFloat(sum(myLikes * theirLikes)) AS pSum \
        SET s.sum = sum1, d.sum = sum2, w.num = num, s.sqSum = sqSum1, \
        d.sqSum = sqSum2, w.pSum = pSum \
        WITH s, w, d \
        SET w.numerator = (w.pSum - (s.sum * d.sum / w.num)), \
        w.denominator = sqrt((s.sqSum - (s.sum * s.sum / w.num)) * \
        (d.sqSum - (d.sum * d.sum / w.num))) \
        WITH w \
        SET w.simPearson = w.numerator / w.denominator";

    var _showPartnersQuery = "MATCH (s:RecommenderSource)-[ \
        w:TO_PARTNER_WITH]->(d:RecommenderDestination) \
        WHERE s.id = {myId} \
        WITH d.id AS othersId ORDER BY w.simPearson DESC SKIP 0 LIMIT 4 \
        MATCH (u:User {id: othersId})-[:LIKE]->(i:Idea)<-[:CATEGORIZE]-(c:Category) \
        WHERE c.name = {categoryName} \
        RETURN DISTINCT u.id, u.name, u.username, u.bio, u.profilePic";

    var _catchPartnerRecommendation = function(session, res) {
        res.send({
            fail: "Failed recommending prospective partners. Please try again."
        });
        session.close();
    };

    var _cleanRecommenderNodes = function(session, res) {
        session
            .run("MATCH (s:RecommenderSource)-[\
                w:TO_PARTNER_WITH]->(d:RecommenderDestination) \
                DETACH DELETE s, w, d")
            .then(function() {
                session.close();
            })
            .catch(function(err) {
                _catchPartnerRecommendation(session, res);
            });
    };

    var _recommendUsers = function(session, req, res) {
        session
            .run(_showPartnersQuery, 
            {
                myId: req.body.userId,
                categoryName: req.body.category
            })
            .then(function(result) {
                res.send({
                    recommended: result.records.map(function(partner) {
                        return {
                            id: partner.get("u.id"),
                            name: partner.get("u.name"),
                            username: partner.get("u.username"),
                            bio: partner.get("u.bio"),
                            profilePic: partner.get("u.profilePic")
                        };
                    })
                });
                _cleanRecommenderNodes(session, res);
            })
            .catch(function(err) {
                _catchPartnerRecommendation(session, res);
            });
    };

    var _processPartners = function(session, result, req, res) {
        var max = result.records[0].get("count(u)") - 8;
        session
            .run(_processPartnersQuery, 
            {
                myId: req.body.userId,
                randomOffset: Math.floor(Math.random() * (max))
            })
            .then(function() {
                _recommendUsers(session, req, res);
            })
            .catch(function(err) {
                _catchPartnerRecommendation(session, res);
            });
    };

    router.post("/recommend/ideas/partners", function(req, res) {
        var session = dbDriver.session();

        session
            .run("MATCH (u:User) WHERE u.role = 'user' RETURN count(u)")
            .then(function(result) {
                _processPartners(session, result, req, res);
            })
            .catch(function(err) {
                _catchPartnerRecommendation(session, res);
            });
    });

};