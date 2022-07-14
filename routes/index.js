var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var mjs = require('../middlewares/signup');
var bcrypt = require('bcryptjs');


// function checkEmail(req,res,next){
//   var email = req.body.email;
//   var checkExistEmail = userModule.findOne({email:email});
//   checkExistEmail.exec((err,data)=>{
//       if(err) throw err;
//       if(data){
//       return res.render('signup', { title: 'Password Management System' , msg:'Email Already Exist'});
//       }
//       next();
//   });
// }



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Password Management System' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Password Management System' ,msg:'',type:''});
});

router.post('/signup',mjs.checkEmail, mjs.checkUserName,function(req, res, next) {
 var username = req.body.uname ;
 var email = req.body.email ;
 var password = req.body.password;
 var cnfpassword = req.body.cnfpassword ;
 if(password != cnfpassword){
  res.render('signup', { title: 'Password Management System', msg:'Password and Confirm Password Must be Same',type:'fail'});
 }else{
  password = bcrypt.hashSync(req.body.password,10);
  var userDetails = new userModule({
    username:username,
    email: email,
    password:password,
    cnfpassword: req.body.cnfpassword,
    
  });
  userDetails.save(function(err,req1){
    if(err) throw err;
    res.render('signup', { title: 'Password Management System', msg:'User Registered Successfully',type:'success' });
    
        });
      }
});



router.get('/PasswordCategory', function(req, res, next) {
  res.render('password_category', { title: 'Password Category List' });
});

router.get('/add-new-category', function(req, res, next) {
  res.render('addNewcategory', { title: 'Password Category List' });
});

router.get('/view-all-password', function(req, res, next) {
  res.render('view-all-password', { title: 'Password Category List' });
});

router.get('/add-new-password', function(req, res, next) {
  res.render('add-new-password', { title: 'Password Category List' });
});

module.exports = router;
