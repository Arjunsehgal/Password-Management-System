var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var passcatModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
var mjs = require('../middlewares/signup');
var mjl = require('../middlewares/login');


// var getPassCat= passcatModel.find({});



/* GET home page. */

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

router.get('/',mjl.checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
  
    passModel.aggregate([
      {
        $lookup:
          {
            from: "password_categories",
            localField: "password_category",
            foreignField: "passord_category",
            as: "pass_cat_details"
          }
     },
     { $unwind : "$pass_cat_details" }
   ]).exec(function(err,results){
       if(err) throw err;
       console.log(results);
       res.send(results);
  
   });
    
    });
 
module.exports = router;
