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
    res.redirect('/dashboard');
  });
  
  router.get('/edit/:id',mjl.checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
      var id =req.params.id;
      var getPassCat= passcatModel.find({});
      var getPassDetails=passModel.findById({_id:id});
      getPassDetails.exec(function(err,data){
    if(err) throw err;
    getPassCat.exec(function(err,data1){
    res.render('edit_password_detail', { title: 'Password Management System',loginUser: loginUser,records:data1,record:data,success:'',type:'' });
    });
});
});
  
    router.post('/edit/:id',mjl.checkLoginUser, function(req, res, next) {
      var loginUser=localStorage.getItem('loginUser');
      var getPassCat1= passcatModel.find({});
      var id =req.params.id;
      var passcat= req.body.pass_cat;
      var project_name= req.body.project_name_or_description;
      var pass_details= req.body.pass_details;
      passModel.findByIdAndUpdate(id,{password_category:passcat,project_name:project_name,password_detail:pass_details}).exec(function(err){
      if(err) throw err;
      var getPassDetails=passModel.findById({_id:id});
      getPassDetails.exec(function(err,data){
    if(err) throw err;
    getPassCat1.exec(function(err,data1){
      if(err) throw err;
      res.render('edit_password_detail', { title: 'Password Management System',loginUser: loginUser,records:data1,record:data, msg:'Password Updated Successfully',type:'success' });
    });
    });
});
});
  
    router.get('/delete/:id', mjl.checkLoginUser,function(req, res, next) {
      var loginUser=localStorage.getItem('loginUser');
      var id =req.params.id;
      var passdelete=passModel.findByIdAndDelete(id);
      passdelete.exec(function(err){
        if(err) throw err;
        res.redirect('/view-all-password/');
      });
});
  


module.exports = router;

  