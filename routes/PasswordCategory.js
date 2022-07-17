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


// router.get('/',mjl.checkLoginUser, function(req, res, next) {
//     var loginUser=localStorage.getItem('loginUser');
//     var getpassCat = passcatModel.find({});
//     getpassCat.exec(function(err,data){
//       if(err) throw err;
//       res.render('password_category', { title: 'Password Category List', loginUser:loginUser ,errors:'',msg:'',type:'',records:data});
//     });
    
// });

// WITHOUT USING PLUGIN

router.get('/',mjl.checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
  
    var perPage = 3;
    var page = req.params.page || 1;
  
    var getAllPassCat = passcatModel.find({});
    getAllPassCat.skip((perPage * page) - perPage)
    .limit(perPage).exec(function(err,data){
        if(err) throw err;
        var getAllPassCat = passcatModel.find({});
        getAllPassCat.countDocuments({}).exec((err,count)=>{ 
        res.render('password_category', {title: 'Password Category List', 
        records: data, 
        loginUser:loginUser ,
        msg:'You are on page '+page,
        type:'success',
        current: page,
        pages: Math.ceil(count / perPage) });
    });
  });
  });

  router.get('/:page', function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
  
    var perPage = 3;
    var page = req.params.page || 1;
  
    var getAllPassCat = passcatModel.find({});
    getAllPassCat.skip((perPage * page) - perPage)
    .limit(perPage).exec(function(err,data){
        if(err) throw err;
        var getAllPassCat = passcatModel.find({});
        getAllPassCat.countDocuments({}).exec((err,count)=>{ 
        res.render('password_category', {title: 'Password Category List', 
        records: data, 
        loginUser:loginUser ,
        msg:'You are on page '+page,
        type:'success',
        current: page,
        pages: Math.ceil(count / perPage) });
    });
  });
  });

router.get('/delete/:id',mjl.checkLoginUser, function(req, res, next) {
var loginUser=localStorage.getItem('loginUser');
var passcat_id = req.params.id;
console.log(passcat_id);
var getpassCat = passcatModel.findByIdAndDelete(passcat_id);
getpassCat.exec(function(err,data){
    if(err) throw err;
    res.redirect('/Passwordcategory');
    // res.render('password_category', { title: 'Password Category List', loginUser:loginUser ,errors:'',msg:'',type:'',records:data});
});

});

router.get('/edit/:id',mjl.checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passcat_id = req.params.id;
    // console.log(passcat_id);
    var getpassCategory = passcatModel.findById(passcat_id);
    getpassCategory.exec(function(err,data){
      if(err) throw err;
      // res.redirect('/Passwordcategory');
      res.render('edit_pass_category', { title: 'Password Category List', loginUser:loginUser ,errors:'',msg:'',type:'',records:data});
    });
    
});

router.post('/edit/',mjl.checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passwordcategory = req.body.passwordcategory;
  
    var update = passcatModel.findByIdAndUpdate(req.body.id,{
      password_category:passwordcategory,
    });
    
    update.exec(function(err,data){
      if(err) throw err;
      res.redirect('/Passwordcategory');
      // res.render('edit_pass_category', { title: 'Password Category List', loginUser:loginUser ,errors:'',msg:'',type:'',records:data});
    });
    
});

  

  module.exports = router;
