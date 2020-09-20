const express = require("express");
const homeRoute = require("../models/home.model");

const router = express.Router();
router.get('/', async function(req, res) {
    const listSailient = await homeRoute.sailient();
    const mostview = await homeRoute.mostview();
    const newpost = await homeRoute.newpost();
    const newbycat = await homeRoute.newpostbycat();
    const posttuyensinh = await homeRoute.postTuyenSinh();
    const postcongnghiep = await homeRoute.postCongNghiep();
    const postphunu = await homeRoute.postPhuNu();
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