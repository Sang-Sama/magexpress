const express = require('express');
const postModel = require('../models/post.model');
const categoryModel = require('../models/category.model');
const censorModel = require('../models/censor.model');
const writemodel = require('../models/write.model');
const usermodel = require('../models/user.model');

const router = express.Router();
router.get('/', async function(req, res) {
    if (req.session.authUser == null || req.session.authUser.Permission != 1) { res.redirect('/') }
    var sess = req.session.authUser;
    const list = await usermodel.all();
    if (sess != null) {
        if (req.session.authUser.Permission == 1) {
            res.render('admin/user', {
                layout: 'admin',
                listuser: list,
                empty: list.length === 0,
            });
        } else {
            res.redirect('/');
        }
    } else { res.redirect('/'); }

})
router.get('/user', async function(req, res) {
    if (req.session.authUser == null || req.session.authUser.Permission != 1) { res.redirect('/') }
    const list = await usermodel.all();
    res.render('admin/user', {
        listuser: list,
        empty: list.length === 0,
        layout: 'admin'
    });
})
router.get('/user/:ID', async function(req, res) {
    if (req.session.authUser == null || req.session.authUser.Permission != 1) { res.redirect('/') }
    const list = await usermodel.single(req.params.ID);
    res.render('admin/single', {
        listuser: list,
        empty: list.length === 0,
        layout: 'admin'
    });
})
router.post('/user/:ID', async function(req, res) {
    const entity = {
        ID: req.params.ID,
        Name: req.body.Name,
        Password: req.body.Password,
        Permission: req.body.Permission,
        Email: req.body.Email,
        TimeActive: req.body.TimeActive
    }
    await usermodel.patch(entity);
    res.redirect('/admin/user');
})

router.get('/post', async function(req, res) {
    if (req.session.authUser == null || req.session.authUser.Permission != 1) { res.redirect('/') }
    const list = await postModel.all();
    const cate = await categoryModel.all();
    for (i = 0; i < list.length; i++) {
        if (list[i].Category == 1) {
            list[i].Category = 'Tuyển Sinh';
        }
        if (list[i].Category == 2) {
            list[i].Category = 'Du Học';
        }
        if (list[i].Category == 3) {
            list[i].Category = 'Champion Leage';
        }
        if (list[i].Category == 4) {
            list[i].Category = 'Laliga';
        }
        if (list[i].Category == 5) {
            list[i].Category = 'Công Nghiệp';
        }
        if (list[i].Category == 6) {
            list[i].Category = 'Nông nghiệp';
        }
        if (list[i].Category == 7) {
            list[i].Category = 'Hồ Sơ Phá Án';
        }
        if (list[i].Category == 8) {
            list[i].Category = 'Tư Vấn';
        }
        if (list[i].Category == 9) {
            list[i].Category = 'Nhà';
        }
        if (list[i].Category == 10) {
            list[i].Category = 'Life Hack';
        }
        if (list[i].Category == 11) {
            list[i].Category = 'Phụ Nữ';
        }
        if (list[i].Category == 12) {
            list[i].Category = 'Đàn Ông';
        }
    }
    res.render('admin/allPost', {
        categories: cate,
        post: list,
        empty: list.length === 0,
        layout: 'admin'
    });
})
router.get('/post/bycat/:catID', async function(req, res) {
    const list = await postModel.allByCat(req.params.catID);
    if (req.session.authUser == null || req.session.authUser.Permission != 1) { res.redirect('/') }
    const cate = await categoryModel.all();
    for (i = 0; i < list.length; i++) {
        if (list[i].Category == 1) {
            list[i].Category = 'Tuyển Sinh';
        }
        if (list[i].Category == 2) {
            list[i].Category = 'Du Học';
        }
        if (list[i].Category == 3) {
            list[i].Category = 'Champion Leage';
        }
        if (list[i].Category == 4) {
            list[i].Category = 'Laliga';
        }
        if (list[i].Category == 5) {
            list[i].Category = 'Công Nghiệp';
        }
        if (list[i].Category == 6) {
            list[i].Category = 'Nông nghiệp';
        }
        if (list[i].Category == 7) {
            list[i].Category = 'Hồ Sơ Phá Án';
        }
        if (list[i].Category == 8) {
            list[i].Category = 'Tư Vấn';
        }
        if (list[i].Category == 9) {
            list[i].Category = 'Nhà';
        }
        if (list[i].Category == 10) {
            list[i].Category = 'Life Hack';
        }
        if (list[i].Category == 11) {
            list[i].Category = 'Phụ Nữ';
        }
        if (list[i].Category == 12) {
            list[i].Category = 'Đàn Ông';
        }
    }
    res.render('admin/allPost', {
        categories: cate,
        post: list,
        empty: list.length === 0,
        layout: 'admin'
    })
})
router.get('/repair/:PostID', async function(req, res) {

    if (req.session.authUser == null || req.session.authUser.Permission != 1) { res.redirect('/') }
    const c = await writemodel.getcategory();
    const list = await censorModel.single(req.params.PostID);
    res.render('censor/single', {
        post: list[0],
        cat: c
    });
})
router.post('/repair/:PostID', async function(req, res) {
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

router.get('/categories', async function(req, res) {
    if (req.session.authUser == null || req.session.authUser.Permission != 1) { res.redirect('/') }

    const list = await categoryModel.all();
    res.render('admin/category', {
        categories: list,
        empty: list.length === 0,
        layout: 'admin'
    });
})

router.get('/categories/add', function(req, res) {
    res.render('vwCategories/add');
})


router.post('/categories/add', async function(req, res) {

    await categoryModel.add(req.body);
    res.render('vwCategories/add');
})

router.get('/categories/edit/:id', async function(req, res) {

    const id = +req.params.id || -1;
    const rows = await categoryModel.single(id);
    if (rows.length === 0)
        return res.send('Invalid parameter.');

    const category = rows[0];
    res.render('vwCategories/edit', { category });
})

router.post('/categories/del', async function(req, res) {
    await categoryModel.del(req.body.CatID);
    res.redirect('/admin/categories');
})

router.post('/categories/update', async function(req, res) {
    await categoryModel.patch(req.body);
    res.redirect('/admin/categories');
})
router.post('/del/:PostID', async function(req, res) {
    await postModel.del(req.params.PostID);
    res.redirect('/admin/post');
})

module.exports = router;