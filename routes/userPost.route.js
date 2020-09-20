const express = require("express");
const userPostRoute = require("../models/userPost.model");

const router = express.Router();

router.get('/', async function(req, res) {
    if (req.session.authUser == null || req.session.authUser.Permission != 0) { res.redirect('/') }
    const listSailient = await userPostRoute.sailient();
    const mostview = await userPostRoute.mostview();
    const newpost = await userPostRoute.newpost();
    const newbycat = await userPostRoute.newpostbycat();
    const posttuyensinh = await userPostRoute.postTuyenSinh();
    const postcongnghiep = await userPostRoute.postCongNghiep();
    const postphunu = await userPostRoute.postPhuNu();
    for (i = 0; i < listSailient.length; i++) {
        if (listSailient[i].Premium == 1) {
            listSailient[i].Premium == true;
        }
    }
    for (i = 0; i < mostview.length; i++) {
        if (mostview[i].Premium == 1) {
            mostview[i].Premium == true;
        }
    }
    for (i = 0; i < newpost.length; i++) {
        if (newpost[i].Premium == 1) {
            newpost[i].Premium == true;
        }
    }
    for (i = 0; i < newbycat.length; i++) {
        if (newbycat[i].Premium == 1) {
            newbycat[i].Premium == true;
        }
    }
    for (i = 0; i < posttuyensinh.length; i++) {
        if (posttuyensinh[i].Premium == 1) {
            posttuyensinh[i].Premium == true;
        }
    }
    for (i = 0; i < postcongnghiep.length; i++) {
        if (postcongnghiep[i].Premium == 1) {
            postcongnghiep[i].Premium == true;
        }
    }
    for (i = 0; i < postphunu.length; i++) {
        if (postphunu[i].Premium == 1) {
            postphunu[i].Premium == true;
        }
    }

    res.render('home', {
        list: listSailient,
        lstmostview: mostview,
        lstnewpost: newpost,
        lstnewpostbycat: newbycat,
        postTuyenSinh: posttuyensinh,
        postCongNghiep: postcongnghiep,
        postPhuNu: postphunu,
    });
})




module.exports = router;