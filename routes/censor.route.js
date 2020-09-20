const { getRounds } = require('bcryptjs');
const express = require('express');
const censorModel = require('../models/censor.model');
const writemodel = require('../models/write.model');
const router = express.Router();

router.get('/', async function(req, res) {
    const list = await censorModel.listdraft(req.session.authUser.ID);
    const categories = await censorModel.category(req.session.authUser.ID)
    for (i = 0; i < categories.length; i++) {
        if (categories[i].category == 1) {
            categories[i].catName = 'Tuyển Sinh';
        }
        if (categories[i].category == 2) {
            categories[i].catName = 'Du Học';
        }
        if (categories[i].category == 3) {
            categories[i].catName = 'Champion Leage';
        }
        if (categories[i].category == 4) {
            categories[i].catName = 'Laliga';
        }
        if (categories[i].category == 5) {
            categories[i].catName = 'Công Nghiệp';
        }
        if (categories[i].category == 6) {
            categories[i].catName = 'Nông nghiệp';
        }
        if (categories[i].category == 7) {
            categories[i].catName = 'Hồ Sơ Phá Án';
        }
        if (categories[i].category == 8) {
            categories[i].catName = 'Tư Vấn';
        }
        if (categories[i].category == 9) {
            categories[i].catName = 'Nhà';
        }
        if (categories[i].category == 10) {
            categories[i].catName = 'Life Hack';
        }
        if (categories[i].category == 11) {
            categories[i].catName = 'Phụ Nữ';
        }
        if (categories[i].category == 12) {
            categories[i].catName = 'Đàn Ông';
        }
    }
    var sess = req.session.authUser;
    if (sess != null) {
        if (req.session.authUser.Permission == 3) {

            res.render('censor/list', {
                category: categories,
                post: list,
                empty: list.length === 0,
                layout: 'censor'
            });
        } else {
            res.redirect('/');
        }
    } else { res.redirect('/'); }

})
router.get('/bycat/:CatID', async(req, res) => {
    const p = await censorModel.bycat(req.params.CatID);
    const categories = await censorModel.category(req.session.authUser.ID)
    for (i = 0; i < categories.length; i++) {
        if (categories[i].category == 1) {
            categories[i].catName = 'Tuyển Sinh';
        }
        if (categories[i].category == 2) {
            categories[i].catName = 'Du Học';
        }
        if (categories[i].category == 3) {
            categories[i].catName = 'Champion Leage';
        }
        if (categories[i].category == 4) {
            categories[i].catName = 'Laliga';
        }
        if (categories[i].category == 5) {
            categories[i].catName = 'Công Nghiệp';
        }
        if (categories[i].category == 6) {
            categories[i].catName = 'Nông nghiệp';
        }
        if (categories[i].category == 7) {
            categories[i].catName = 'Hồ Sơ Phá Án';
        }
        if (categories[i].category == 8) {
            categories[i].catName = 'Tư Vấn';
        }
        if (categories[i].category == 9) {
            categories[i].catName = 'Nhà';
        }
        if (categories[i].category == 10) {
            categories[i].catName = 'Life Hack';
        }
        if (categories[i].category == 11) {
            categories[i].catName = 'Phụ Nữ';
        }
        if (categories[i].category == 12) {
            categories[i].catName = 'Đàn Ông';
        }
    }
    res.render('censor/bycat', {
        layout: 'censor',
        post: p,
        category: categories,
    })
})
router.get('/:PostID', async function(req, res) {
    const list = await censorModel.single(req.params.PostID);
    const c = await writemodel.getcategory();
    res.render('censor/single', {
        post: list[0],
        cat: c,
        layout: 'censor'
    });
})
router.post('/:PostID', async function(req, res) {
    console.log(req.body.reason);
    console.log("wrong");
    if (req.body.hasOwnProperty("deny")) {

        const entity = {
            PostID: req.params.PostID,
            Note: req.body.reason,
            Status: 1
        }
        await censorModel.patch(entity);
        res.redirect('/censor');
    } else {

        const entity = {
            PostID: req.params.PostID,
            Premium: req.body.tag,
            Category: req.body.category,
            Status: 0
        }
        await censorModel.patch(entity);
        res.redirect('/censor');
    }
})

module.exports = router;