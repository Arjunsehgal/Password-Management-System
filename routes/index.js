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


function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}



router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard');
  }else{
//   res.redirect('/')
  res.render('index', { title: 'Password Management System',msg:'',type:'' });
   } }
);


router.post('/', function(req, res, next) {
  var username=req.body.uname;
  var password=req.body.password;
  var checkUser=userModule.findOne({username:username});
  checkUser.exec((err, data)=>{
   if(data==null){
    res.render('index', { title: 'Password Management System', msg:"No Credentials Found.",type:'fail' });

   }else{
if(err) throw err;
var getUserID=data._id;
var getPassword=data.password;
if(bcrypt.compareSync(password,getPassword)){
  var token = jwt.sign({ userID: getUserID }, 'loginToken');
  localStorage.setItem('userToken', token);
  localStorage.setItem('loginUser', username);
  //res.render('index', { title: 'Password Management System', msg:"Welcome You Are Authenticated." ,type:'success'});
  res.redirect('/dashboard');
}else{
  res.render('index', { title: 'Password Management System', msg:"Invalid Username Or Password." ,type:'fail'});

}
   }
  });
 
});

router.get('/signup', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard');
  }else{
  res.render('signup', { title: 'Password Management System' ,msg:'',type:''});
  }
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













router.get('/logout', function(req, res, next) {
localStorage.removeItem('userToken');
localStorage.removeItem('loginUser');
res.redirect('/');
//res.render({msg:'You are Successfully Logged Out',type:'success'});

  //res.render('index', { title: 'Password Category List',msg:'You Are Successfully Logged Out',type:'success' });
});

module.exports = router;



















// if(req.body.name == '' || req.body.email=='' || req.body.password=='' || req.body.confirm == ''){
//   req.session.message = {
//     type: 'danger',
//     intro: 'Empty fields! ',
//     message: 'Please insert the requested information.'
//   }
//   res.redirect('/')
// }
// else if(req.body.password != req.body.confirm){
//   req.session.message = {
//     type: 'danger',
//     intro: 'Passwords do not match! ',
//     message: 'Please make sure to insert the same password.'
//   }
//   res.redirect('/')
// }
// else{
//   req.session.message = {
//     type: 'success',
//     intro: 'You are now registered! ',
//     message: 'Please log in.'
//   }

//   console.log(req.body.name, req.body.email, req.body.password)
//   res.redirect('/')
// }



// <!-- <% if( message != ''){ %>
//   <div style="text-align: center" class="alert alert-<%= message.type %>">
//     <button type="button" class="close" data-dismiss="alert">&times;</button>
//     <strong><%= message.intro %></strong> <%= message.message %>
//   </div>

//   <% } %> -->
















