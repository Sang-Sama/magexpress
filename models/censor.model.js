const db = require("../utils/db");
const TBL_POST = 'posts';
module.exports = {
    listdraft: function(UserID) {
        return db.load(`SELECT * FROM  posts WHERE Status = 2 and Category in (SELECT Category from division where UserID = ${UserID})`);
    },
    single: function(id) {
        return db.load(`select * from posts where PostID = ${id }`);
    },
    patch: function(entity) {
        const condition = {
            PostID: entity.PostID,

        }
        delete entity.PostID;
        return db.patch(TBL_POST, entity, condition);
    },
    category: function(UserID) {
        return db.load(`SELECT category, UserID, ID FROM division WHERE UserID =${UserID}`)
    },
    bycat: function(CatID) {
        return db.load(`SELECT * FROM  posts WHERE Status = 2 and Category  = ${CatID}`);
    }
}