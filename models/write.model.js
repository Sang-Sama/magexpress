const db = require('../utils/db');

const TBL_POST = 'posts';

module.exports = {
    admitpost: function(UserID) {
        return db.load(`select * from ${TBL_POST} where UserID = ${UserID} and Status =0`);
    },
    denypost: function(UserID) {
        return db.load(`select * from ${TBL_POST} where UserID = ${UserID} and Status =1`);
    },
    Nonapproved: function(UserID) {
        return db.load(`select * from ${TBL_POST} where UserID = ${UserID} and Status =2`);
    },
    getcategory: function() {
        return db.load('select * from categories');
    },
    add: function(entity) {
        return db.add(TBL_POST, entity);

    },
    repair: function(entity) {
        const condition = {
            PostID: entity.PostID
        }
        delete entity.PostID;
        console.log(entity);
        return db.patch(TBL_POST, entity, condition);
    },
    single: function(id) {
        return db.load(`select * from ${TBL_POST} where PostID = ${id }`);
    },

};