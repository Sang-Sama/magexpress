const express = require('express');
const postModel = require('../models/post.model');

const router = express.Router();

router.get('/', async function(req, res) {
    const list = await postModel.all();
    res.render('vwPosts/list', {
        post: list,
        empty: list.length === 0
    });
})

module.exports = router;