const db = require('../utils/db');

const TBL_POST = 'posts';

module.exports = {
    fulltextsearch: function(text) {
        return db.load(`SELECT * FROM posts
        WHERE MATCH (Content,Title)
        AGAINST ('${text}' IN NATURAL LANGUAGE MODE) ORDER by Premium DESC;`);
    },
    all: function() {
        return db.load(`select * from ${TBL_POST}`);
    },
    allByCat: function(catId) {
        return db.load(`select * from ${TBL_POST} where Category = ${catId}`);
    },
    someByCat: function(postid) {
        return db.load(`SELECT * FROM ${TBL_POST} WHERE PostID != ${postid} and Category = (SELECT Category FROM ${TBL_POST} WHERE PostID = '${postid}') LIMIT 5`);
    },
    newElseCat: function(catID) {
        return db.load(`SELECT * FROM ${TBL_POST} WHERE Category != ${catID}  ORDER by Date DESC LIMIT 11`);
    },

    pageByCat: function(catId, limit, offset) {
        return db.load(`select * from ${TBL_POST} where Category = ${catId } limit ${limit} offset ${offset}`);
    },
    countByCat: async function(catId) {
        const rows = await db.load(`select count(*) as total from ${TBL_POST} where Category = ${catId }`);
        return rows[0].total;
    },
    single: function(id) {
        return db.load(`select * from ${TBL_POST} where PostID = ${id }`);
    },
    comment: function(id) {
        return db.load(` select * from comment where PostID = ${id} order by Time ASC `);
    },
    insertcomment: function(entity) {
        const s = "comment";
        return db.add(s, entity);
    },
    del: function(id) {
        const condition = {
            PostID: id
        }
        return db.del(TBL_POST, condition);
    },
    updateConf: function(entity) {
        const condition = {
            PostID: entity.PostID
        }
        delete entity.PostId;
        return db.patch(TBL_POST, entity, condition);
    }
};