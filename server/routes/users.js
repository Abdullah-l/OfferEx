const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require('../models/Product');
const { Offer } = require('../models/Offer');
const { auth } = require("../middleware/auth");

const async = require('async');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.post("/resetPass", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                resetPass: false,
                message: "Auth failed, email not found"
            });
        if (req.body.secAnswer === user.secAnswer){
                user.password = req.body.password;
                user.save((err, doc) => {
                    if (err) return res.json({ success: false, err });
                    return res.status(200).json({
                        success: true
                    });
                });
            }
            else{
                return res.json({
                    resetPass: false,
                    message: "Auth failed, Security Question is incorrect"
                });
            }
    });
});
router.post("/resetPassCheck", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                emailFound: false,
                message: "Auth failed, email not found"
            });
            return res.json({
                emailFound: true,
                secChoice: user.secChoice
            });

    });
});
router.post("/changePass", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                changePass: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.oldPassword, (err, isMatch) => {
            if (!isMatch)
                return res.json({ changePass: false, message: "Wrong current password" });

                user.password = req.body.password;
                user.save((err, doc) => {
                    if (err) return res.json({ success: false, err });
                    return res.status(200).json({
                        success: true
                    });
                });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});


router.get('/getHistory', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, doc) => {
            let history = doc.history;
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, history })
        }
    )
})


module.exports = router;
