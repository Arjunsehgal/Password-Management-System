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

// Without Using Plugin 'PAGINATION'

/** 
router.get('/view-all-password',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');

  var perPage = 3;
  var page = req.params.page || 1;

  var getAllPass = passModel.find({});
  getAllPass.skip((perPage * page) - perPage)
  .limit(perPage).exec(function(err,data){
      if(err) throw err;
      var getAllPass = passModel.find({});
      getAllPass.countDocuments({}).exec((err,count)=>{ 
      res.render('view-all-password', {title: 'Password Category List', 
      records: data, 
      loginUser:loginUser ,
      current: page,
      pages: Math.ceil(count / perPage) });
  });
});
});

router.get('/view-all-password/:page', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');

  var perPage = 3;
  var page = req.params.page || 1;

  var getAllPass = passModel.find({});
  getAllPass.skip((perPage * page) - perPage)
  .limit(perPage).exec(function(err,data){
      if(err) throw err;
      var getAllPass = passModel.find({});
      getAllPass.countDocuments({}).exec((err,count)=>{ 
      res.render('view-all-password', {title: 'Password Category List', 
      records: data, 
      loginUser:loginUser ,
      msg:'',
      type:'' ,
      current: page,
      pages: Math.ceil(count / perPage) });
  });
});
});
**/


// Using Plugin 'PAGINATION'

router.get('/',mjl.checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var query = {};
    var perPage = 3;
    var page = req.params.page || 1;
  
    var options = {
      offset:   page, 
      limit:    perPage,
  };
  
      passModel.paginate(query, options).then(function(result) {
        res.render('view-all-password', {title: 'Password Category List', 
        records: result.docs, 
        loginUser:loginUser ,
        msg:'You Are On Page '+page,
        type:'success' ,
        current: result.offset,
        pages: Math.ceil(result.total / result.limit) ,    // result.total
    });
      });
  });
  
  router.get('/:page',mjl.checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
  
    var perPage = 3;
    var page = req.params.page || 1;
  
    var getAllPass = passModel.find({});
    getAllPass.skip((perPage * page) - perPage)
    .limit(perPage).exec(function(err,data){
        if(err) throw err;
        var getAllPass = passModel.find({});
        getAllPass.countDocuments({}).exec((err,count)=>{ 
        res.render('view-all-password', {title: 'Password Category List', 
        records: data, 
        loginUser:loginUser ,
        msg:'You Are On Page '+page,
        type:'success' ,
        current: page,
        pages: Math.ceil(count / perPage) });
    });
  });
});

module.exports = router;
