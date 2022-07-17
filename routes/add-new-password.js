var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var passcatModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
var mjs = require('../middlewares/signup');
var mjl = require('../middlewares/login');
const session = require('express-session');
const { matchedData, validationResult, check } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require ('jsonwebtoken');
var getPassCat= passcatModel.find({});



/* GET home page. */

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

router.get('/',mjl.checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
  
    var getpasscatdetail = passcatModel.find({});
    getpasscatdetail.exec(function(err,data){
      if(err) throw err;
      res.render('add-new-password', { title: 'Password Category List', loginUser:loginUser , msg:'',type:'',records:data });
    });
    
});

router.post('/',mjl.checkLoginUser,[
    check('pass_details','Password details Should Not be empty.').isEmpty()],
   function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
  
    var pass_cat = req.body.pass_cat;
    var project_name = req.body.project_name_or_description;
    var pass_details = req.body.pass_details;
    var passwordModel = new passModel({
      password_category : pass_cat,
      project_name:project_name,
      password_detail : pass_details,
    });
  
    passwordModel.save(function(err,data){
      if(err) throw err;
      res.redirect('/view-all-password');
      // res.render('add-new-password', { title: 'Password Category List', loginUser:loginUser , msg:'Password Added.',type:'success',records:data });
      
    });
    
  });


module.exports = router;