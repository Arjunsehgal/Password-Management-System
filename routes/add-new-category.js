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
  
    res.render('addNewcategory', { title: 'Password Category List', loginUser:loginUser,errors:'' ,msg:'',type:'' });
});


router.post('/',mjl.checkLoginUser,
[ //check('passwordcategory','Enter Password Category Name').isLength({min:1}),
 check('passwordcategory','Enter Characters Only').isAlpha()] ,
function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');

  const errors=validationResult(req);
  if(!errors.isEmpty()){
    //console.log(errors.mapped());

    res.render('addNewcategory', { title: 'Password Category List', loginUser:loginUser ,errors:errors.mapped(),msg:'',type:'fail'});
  }else{

    var passCatName = req.body.passwordcategory;
    var passcatdetails = new passcatModel({
      password_category : passCatName,
    });
    passcatdetails.save((err,doc)=>{
      if(err) throw err;
      res.redirect('/PasswordCategory')
      // res.render('addNewcategory', { title: 'Password Category List', loginUser:loginUser ,errors:'',msg:'Password category Added.',type:'success' });
    });
    
  }

  
});




module.exports = router;
