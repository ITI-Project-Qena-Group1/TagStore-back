var express = require('express');
 var  sellerModel = require("../models/sellers")
var jwt = require("jsonwebtoken");
var router = express.Router();
const fs = require("fs");
var {authseller}=require("../../middlewares/auth1")

var bcrypt = require('bcrypt');


var {postseller,patchseller,deleteseller,getseller} = require("../../controllers/admin/sellers");



router.post("/", async function (req, res, next) {
  try{
 var newuser = req.body;
 
 var result = await postseller(newuser)
 res.json(result);
 }catch(err){
  res.status(404).json("Error:invalide value ")
 }

})

router.patch("/:id", async function (req, res, next) {

  try {
    var userId = req.params.id;
    var statu = req.body;

    var founded = await patchseller(userId, statu);
    res.json(founded);

    } catch (err) {
    res.status(422).send(err);
  }

})

router.delete("/:id",authseller, async function (req, res) {
  try {
    var userId = req.params.id;
    var found = await deleteseller(userId);

    res.json(found);
  } catch (err) {
    res.status(422).send(err);
  }
})
router.get("/", authseller,async function (req, res) {
    try {
      var data = await getseller();
      res.json(data);
  
    } catch (err) {
      res.status(422).json("nooo");
    }
  });
  
  
  
  
  
  router.post("/login", async function (req, res, next) {
    const { sellerfirstName, password } = req.body;
  
    var seller = await sellerModel.findOne({sellerfirstName: sellerfirstName}).exec()    
    if (seller) {
      var valid = bcrypt.compareSync(password, seller.password);
      if (valid) {
        
  var tokenn = jwt.sign({
        data: { sellerfirstName: sellerfirstName, sellerId: seller.id }
      }, process.env.SECRET, { expiresIn: '100h' });

      res.json(tokenn)

    } else {
      res.status(401).json("please insert correct data")
    }} else {
      res.status(401).json("username or password is invalid try again")
    }
  
  
  })
 
module.exports = router