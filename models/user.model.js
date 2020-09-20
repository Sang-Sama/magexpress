const db = require('../utils/db');

const TBL_USERS = 'user';

module.exports = {
    all: function() {
        return db.load(`select * from ${TBL_USERS} where Permission != 1 `);
    },
    single: function(id) {
        return db.load(`select * from ${TBL_USERS} where ID = ${id}`);
    },
    singleByUserName: async function(username) {
        const rows = await db.load(`select * from ${TBL_USERS} where Username = '${username}'`);
        if (rows.length === 0)
            return null;

        return rows[0];
    },
    add: function(entity) {
        return db.add(TBL_USERS, entity);
    },
    patch: function(entity) {
        const condition = {
            ID: entity.ID
        }
        delete entity.ID;
        return db.patch(TBL_USERS, entity, condition);
    },
    del: function(ID) {
        const condition = { ID }
        return db.del(TBL_USERS, condition);
    }
};