const express = require('express');
const postsModel = require('../models/post.model');
const config = require('../config/default.json');

const router = express.Router();
router.get('/search', async function(req, res) {

    res.render('vwPosts/search')
});
router.post('/search', async function(req, res) {
    const rows = await postsModel.fulltextsearch(req.body.search);

    res.render('vwPosts/search', {
        empty: rows.length === 0,
        post: rows
    });
});
router.get('/detail/:postid', async function(req, res) {
    const rows = await postsModel.single(req.params.postid);
    const c = await postsModel.comment(req.params.postid);
    const f = await postsModel.someByCat(req.params.postid);

    const x = parseInt(rows[0].Conf, 10);
    const entity = {
        PostID: req.params.postid,
        Conf: x + 1
    }
    const k = await postsModel.updateConf(entity);
    for (i = 0; i < rows.length; i++) {
        if (rows[i].Premium == 1) {
            rows[i].Premium = true;
        }
    }
    for (i = 0; i < f.length; i++) {
        if (f[i].Premium == 1) {
            f[i].Premium = true;
        }
    }
    res.render('vwPosts/detail', {
        post: rows[0],
        comment: c,
        somebycat: f
    });
});

router.post('/detail/:postid', async function(req, res) {
    if (req.session.authUser != null) {
        entity = {
                Content: req.body.comment,
                UserName: req.session.authUser.Name,
                PostID: req.params.postid,
                Time: new Date().toLocaleString()
            }
            // console.log(new Date().toLocaleString());
        var c = req.params.postid;
        await postsModel.insertcomment(entity);
        res.redirect(`/post/detail/${c}`);
    } else {
        res.redirect('/account/login');
    }
});

router.get('/byCat/:catId', async function(req, res) {

    // for (const c of res.locals.lcCategories) {
    //     if (c.CatID === +req.params.catId) {
    //         c.isActive = true;
    //     }
    // } // sign Active for category 


    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const offset = (page - 1) * config.pagination.limit;

    const [list, total, elseCat] = await Promise.all([
        // postsModel.pageByCat(req.params.catId, config.pagination.limit, offset),
        postsModel.pageByCat(req.params.catId, 10, 0),
        postsModel.countByCat(req.params.catId),
        postsModel.newElseCat(req.params.catId),
    ]);


    const nPages = Math.ceil(total / config.pagination.limit);
    const page_items = [];

    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        page_items.push(item);
    }

    res.render('vwPosts/byCat', {
        elseCat: elseCat,
        posts: list,
        empty: list.length === 0,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages
    });
})

module.exports = router;
module.exports = router;