const express = require('express');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const restrict = require('../middlewares/auth.mdw');
const config = require('../config/default.json');
var nodemailer = require('nodemailer');

const router = express.Router();

router.get('/forgotPass', async function(req, res) {

    res.render('vwAccount/forgotPass', {
        layout: false
    });
})
router.get('/forgot', async function(req, res) {
    lst = await userModel.singleByUserName(req.query.username)
    var PassWordNew = "";
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
        PassWordNew += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    var transporter = nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: 'vansangsks@gmail.com',
            pass: '12345sang'
        }
    });
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Sang-Sama',
        to: lst.Email,
        subject: 'Change Your Password',
        text: 'You recieved message ',
        html: 'Dear: ' + lst.Name + ' you Password New is : ' + PassWordNew + ' Change your password the next time you log in     '
    }
    transporter.sendMail(mainOptions, function(err, info) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            console.log('Message sent: ' + info.response);
            res.redirect('/');
        }
    });
    console.log("PassWord New is : " + PassWordNew);
    const password_hash = bcrypt.hashSync(PassWordNew, config.authentication.saltRounds);
    var entity = {
        ID: lst.ID,
        Password: password_hash
    }
    await userModel.patch(entity);
    res.redirect('/account/login');
})
router.post('/profile/:ID', async function(req, res) {
    var entity = {
        ID: req.params.ID,
        Name: req.body.name,
        PenName: req.body.penname,
    }
    console.log(entity);
    await userModel.patch(entity);
    res.redirect('/account/profile');
})
router.get('/edit/:ID', async function(req, res) {
    lst = await userModel.single(req.params.ID)
    res.render('vwAccount/edit', {
        list: lst
    });
})
var rand = 0;
router.get('/OTP/:ID', async function(req, res) {
    rand = Math.floor(Math.random() * 900000) + 100000;
    var transporter = nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: 'vansangsks@gmail.com',
            pass: '12345sang'
        }
    });
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Sang-Sama',
        to: req.session.authUser.Email,
        subject: 'Verify your account',
        text: 'You recieved message ',
        html: 'Dear: ' + req.session.authUser.Name + ' you verify code is : ' + rand + ' do not share it with anyone  '
    }
    transporter.sendMail(mainOptions, function(err, info) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            console.log('Message sent: ' + info.response);
            res.redirect('/');
        }
    });
    console.log("OTP is : " + rand);
    res.render('vwAccount/OTP', {
        layout: false
    });
})
router.post('/OTP/:ID', async function(req, res) {
        const password_hash = bcrypt.hashSync(req.query.password, config.authentication.saltRounds);
        const dob = moment(req.query.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
        var entity = {
            ID: req.params.ID,
            Password: password_hash,
        }
        if (req.query.password == "") {
            delete entity.Password;
        }
        if (req.body.otp == rand) {
            console.log(entity);
            await userModel.patch(entity);
            res.redirect('/account/profile');
        } else {
            res.redirect(req.originalUrl);
        }


    })
    // router.post('/edit/:ID', async function(req, res) {
    //     const password_hash = bcrypt.hashSync(req.body.password, config.authentication.saltRounds);
    //     var entity = {
    //         ID: req.params.ID,
    //         Name: req.body.name,
    //         Email: req.body.email,
    //         Dob: req.body.dob,
    //         Password: password_hash
    //     }
    //     if (req.body.password == "") {
    //         delete entity.Password;
    //     }
    //     if (req.body.name == "") {
    //         delete entity.Name;
    //     }
    //     if (req.body.email == "") {
    //         delete entity.Email;
    //     }
    //     if (req.body.dob == "__/__/____") {
    //         delete entity.Dob;
    //     }
    //     //console.log(entity);

//     //await userModel.patch(entity);
//     res.redirect('/account/profile');
// })
router.get('/login', async function(req, res) {
    res.render('vwAccount/login', {
        layout: false
    });
})

router.post('/login', async function(req, res) {
    const user = await userModel.singleByUserName(req.body.username);
    if (req.body.hasOwnProperty("forgotPassword")) {
        res.redirect('forgotPass')
    } else {
        if (user === null) {
            return res.render('vwAccount/login', {
                layout: false,
                err: 'Invalid username or password.'
            })
        }

        const rs = bcrypt.compareSync(req.body.password, user.Password);
        if (rs === false) {
            return res.render('vwAccount/login', {
                layout: false,
                err: 'Invalid username or password.'
            })
        }
        var currentdate = new Date();
        const val = ((Date.now() - user.TimeRegister) / 1000) / 60;
        // console.log(val);
        if (val > user.TimeActive) {
            return res.render('vwAccount/login', {
                layout: false,
                err: 'Your Account is not Active.'
            })
        }

        delete user.Password;
        req.session.isAuthenticated = true;
        req.session.authUser = user;
        //  console.log(req.session.authUser.Permission);
        if (req.session.authUser.Permission == 0) {
            var url = req.query.retUrl || '/user';
            res.redirect(url);
        } else if (req.session.authUser.Permission == 1) {
            var url = req.query.retUrl || '/admin';
            res.redirect(url);
        } else if (req.session.authUser.Permission == 2) {
            var url = req.query.retUrl || '/writer';
            res.redirect(url);
        } else if (req.session.authUser.Permission == 3) {
            var url = req.query.retUrl || '/censor';
            res.redirect(url);
        } else {
            var url = req.query.retUrl || '/';
            res.redirect(url);
        }
    }
})

router.post('/logout', restrict, function(req, res) {
    req.session.isAuthenticated = false;
    req.session.authUser = null;
    res.redirect('/');
})

router.get('/register', async function(req, res) {
    res.render('vwAccount/_register');
})

router.post('/register', async function(req, res) {
    let us = false;
    const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    us = await userModel.singleByUserName(req.body.username)
    const password_hash = bcrypt.hashSync(req.body.password, config.authentication.saltRounds);
    const entity = {
        Username: req.body.username,
        Password: password_hash,
        Name: req.body.name,
        Email: req.body.email,
        Dob: dob,
        Permission: 0,
        TimeRegister: Date.now()

    }
    if (us == null) {
        await userModel.add(entity);
        res.redirect('/account/login/?flag=true');

    } else {
        res.render('vwAccount/_register', { errMess: true });
    }
})
router.get('/profile', async function(req, res) {
    const list = await userModel.single(req.session.authUser.ID)
    if (list[0].Permission == 1) { list[0].Permission = "Admin"; }
    if (list[0].Permission == 2) { list[0].Permission = "Writer"; }
    if (list[0].Permission == 3) { list[0].Permission = "Censor"; }
    if (list[0].Permission == 0) { list[0].Permission = "User"; }
    res.render('vwAccount/profile', {
        post: list,
        layout: false
    });
})

router.get('/is-available', async function(req, res) {
    const user = await userModel.singleByUserName(req.query.user);
    if (!user) {
        return res.json(true);
    }

    res.json(false);
})
router.get('/available', async function(req, res) {
    const user = await userModel.singleByUserName(req.query.user);
    if (!user) {
        return res.json(user.ID);
    }

    res.json(false);
})
module.exports = router;