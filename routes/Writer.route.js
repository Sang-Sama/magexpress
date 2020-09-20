const express = require('express');
const multer = require('multer');
const writemodel = require("../models/write.model");
const router = express.Router();


router.get('/', async function(req, res) {
    const c = await writemodel.getcategory();
    var sess = req.session.authUser;
    if (sess != null) {
        if (req.session.authUser.Permission == 2) {

            res.render('vwwriter/wysiwyg', {
                layout: 'writer',
                cat: c,
            });
        } else {
            res.redirect('/');
        }
    } else { res.redirect('/'); }

})
router.post('/', async function(req, res) {
    var d = new Date();
    var c = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + " " + (d.getHours() + 1) + ":" + d.getMinutes() + ":00";
    //console.log(d.getMonth());
    const entity = {
        Title: req.body.title,
        Category: req.body.category,
        Content: req.body.FullDes,
        ImageLink: req.body.linkimage,
        Tinycontent: req.body.tinydes,
        Premium: req.body.tag,
        UserID: req.session.authUser.ID,
        Status: 2,
        Date: c
    }
    console.log(entity);
    await writemodel.add(entity);
    res.redirect('/writer')
})

router.get('/deny', async function(req, res) {

    const list = await writemodel.denypost(req.session.authUser.ID);
    res.render('vwwriter/load', {
        post: list,
        empty: list.length === 0,
        flag: true,
        layout: 'writer'
    });

})
router.get('/detail/:id', async function(req, res) {
    const rows = await writemodel.single(req.params.id);
    for (i = 0; i < rows.length; i++) {
        if (rows[i].Premium == 1) {
            rows[i].Premium == true;
        }
    }
    res.render('vwWriter/detail', {
        post: rows[0],
        layout: 'writer',
    });
})
router.get('/admit', async function(req, res) {
    const list = await writemodel.admitpost(req.session.authUser.ID);
    res.render('vwwriter/load', {
        post: list,
        empty: list.length === 0,
        flag: list.length === 0,
        layout: 'writer'
    });

})
router.get('/approvedyet', async function(req, res) {
    const list = await writemodel.Nonapproved(req.session.authUser.ID);
    res.render('vwwriter/load', {
        post: list,
        empty: list.length === 0,
        flag: true,
        layout: 'writer'
    });

})
router.get('/repair/:PostID', async function(req, res) {
    const c = await writemodel.getcategory();
    // console.log(req.params.PostID);
    const f = await writemodel.single(req.params.PostID);
    //console.log(req.params.PostID);
    res.render('vwwriter/repair', {
        cat: c,
        singlepost: f,
        layout: 'writer'
    });
})
router.post('/repair/:PostID', async function(req, res) {
    var d = new Date();
    var c = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + " " + (d.getHours() + 1) + ":" + d.getMinutes() + ":00";
    const entity = {
        PostID: req.params.PostID,
        Title: req.body.title,
        Category: req.body.category,
        Content: req.body.FullDes,
        ImageLink: req.body.linkimage,
        Tinycontent: req.body.tinydes,
        Premium: req.body.tag,
        UserID: req.session.authUser.ID,
        Status: 2,
        Date: c
    }
    console.log(entity);
    const s = await writemodel.repair(entity);
    console.log(s);
    res.redirect('/writer/approvedyet');
})



router.get('/upload', function(req, res) {
    res.render('vwwriter/upload');
})


router.post('/upload', function(req, res) {
    //.....

    const storage = multer.diskStorage({
        filename(req, file, cb) {
            cb(null, file.originalname);
        },
        destination(req, file, cb) {
            cb(null, './public/imgs');
        }
    })

    const upload = multer({ storage });
    upload.array('fuMain', 3)(req, res, function(err) {
        if (!err)
            res.render('vwDemo/upload');
        else res.send('err');
    })
})

module.exports = router;