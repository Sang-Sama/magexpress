const db = require("../utils/db");
module.exports = {
    sailient: function() {
        return db.load(`SELECT * FROM posts where Status =0
        GROUP by Conf 
        ORDER BY Conf DESC
        LIMIT 3`);
    },
    mostview: function() {
        return db.load(`SELECT * FROM posts where Status =0  
            GROUP by Conf 
            ORDER BY Conf DESC
            LIMIT 10`);
    },
    newpost: function() {
        return db.load(`SELECT * FROM posts where Status =0 ORDER BY Date DESC LIMIT 10`);
    },
    newpostbycat: function() {
        return db.load(`SELECT * FROM posts where Status =0  GROUP by Category ORDER BY Date DESC`);
    },
    postTuyenSinh: function() {
        return db.load("SELECT * FROM `posts` WHERE Status =0 and category=1 and Hot=0 ORDER BY Date DESC LIMIT 5");
    },
    postDuHoc: function() {
        return db.load("SELECT * FROM `posts` WHERE Status =0 and category=2 and Hot=0 ORDER BY Date DESC LIMIT 5");
    },
    postChampionLeage: function() {
        return db.load("SELECT * FROM `posts` WHERE Status =0 and category=3 and Hot=0 ORDER BY Date DESC LIMIT 5");
    },
    postPhuNu: function() {
        return db.load("SELECT * FROM `posts` WHERE Status =0 and category=11 and Hot=0 ORDER BY Date DESC LIMIT 5");
    },
    postCongNghiep: function() {
        return db.load("SELECT * FROM `posts` WHERE Status =0 and category=5 and Hot=0 ORDER BY Date DESC LIMIT 5");
    },
    postNongNghiep: function() {
        return db.load("SELECT * FROM `posts` WHERE Status =0 and category=6 and Hot=0 ORDER BY Date DESC LIMIT 5");
    }

}