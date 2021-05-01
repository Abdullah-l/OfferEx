const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Offer } = require("../models/Offer");
const { auth } = require("../middleware/auth");

const async = require("async");

//=================================
//             Offer
//=================================

router.post("/addOffer", (req, res) => {
  console.log(req.body);
  const offer = new Offer(req.body);

  offer.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.get("/getOffers", (req, res) => {
  console.log(req.query);

  Offer.find({ [req.query.mode]: req.query.userId })
    .populate("product", ["title", "images", "sold"])
    .populate("seller", "name")
    .populate("buyer", "name")
    .sort({'createdAt' : -1, 'product': 1})
    .exec((err, offers) => {
      if (err) {
        return res.status(400).send(err);
      } else {
        console.log(offers);

        return res.status(200).send({ offers });
      }
    });
});

router.put("/acceptOffer", (req, res) => {
  console.log(req.body);

  Promise.all([
    Offer.findByIdAndUpdate({ _id: req.body.offerId }, { $set: { status: 1, message: req.body.message } }),
    Offer.updateMany(
      { product: req.body.productId, status : 0 },
      { $set: { status: 2, message: "Seller accepted another offer" } }
    ),
    Product.findByIdAndUpdate({ _id: req.body.productId }, { $set: { sold: 1} }),
  ]).then((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send();
    }
  });
});

router.put("/rejectOffer", (req, res) => {

    Offer.findByIdAndUpdate({ _id: req.body.offerId }, { $set: { status: 2, message: req.body.message } })
    .then((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send();
    }
  });
});

router.get("/getSellerOffers", (req, res) => {
  
    Offer.find({ 'seller': req.query.userId, status : req.query.status })
      .populate("buyer", ['name', 'rating'])
      .sort({'product': 1, 'createdAt' : -1})
      .exec((err, offers) => {
        if (err) {
          return res.status(400).send(err);
        } else {
          console.log(offers);
  
          return res.status(200).send({ offers });
        }
      });
  });

router.get("/getPublicOffers", (req, res) => {
  
    Offer.find({ 'product': req.query.productId})
      .populate("buyer", ['name', 'rating'])
      .sort({'status': 1, 'createdAt' : -1})
      .exec((err, offers) => {
        if (err) {
          return res.status(400).send(err);
        } else {
          console.log(offers);
  
          return res.status(200).send({ offers });
        }
      });
  });

  router.put("/addRating", (req, res) => {

    Promise.all([
      Product.findByIdAndUpdate({ _id: req.body.productId }, { $set: { sold: req.body.sold} }),
      User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { rating: req.body.rating } })
    ]).then((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.status(200).send();
      }
    });
  });

module.exports = router;
