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



/* GET home page. */

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
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


function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}



router.get('/dashboard', checkLoginUser,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  
  res.render('dashboard', { title: 'Password Management System', loginUser:loginUser ,msg:'',type:''});
});

router.get('/PasswordCategory',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var getpassCat = passcatModel.find({});
  getpassCat.exec(function(err,data){
    if(err) throw err;
    res.render('password_category', { title: 'Password Category List', loginUser:loginUser ,errors:'',msg:'',type:'',records:data});
  });
  
});

router.get('/PasswordCategory/delete/:id',checkLoginUser, function(req, res, next) {
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

router.get('/PasswordCategory/edit/:id',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcat_id = req.params.id;
  console.log(passcat_id);
  var getpassCategory = passcatModel.findById(passcat_id);
  getpassCategory.exec(function(err,data){
    if(err) throw err;
    // res.redirect('/Passwordcategory');
    res.render('edit_pass_category', { title: 'Password Category List', loginUser:loginUser ,errors:'',msg:'',type:'',records:data});
  });
  
});

router.post('/PasswordCategory/edit/',checkLoginUser, function(req, res, next) {
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

router.get('/add-new-category',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');

  res.render('addNewcategory', { title: 'Password Category List', loginUser:loginUser,errors:'' ,msg:'',type:'' });
});

router.post('/add-new-category',checkLoginUser,
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

router.get('/view-all-password',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var getAllPass = passModel.find({});
  getAllPass.exec(function(err,data){
    if(err) throw err;
    res.render('view-all-password', { title: 'Password Category List', loginUser:loginUser ,msg:'',type:'' ,records:data});
  });
  
});

router.get('/add-new-password',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');

  var getpasscatdetail = passcatModel.find({});
  getpasscatdetail.exec(function(err,data){
    if(err) throw err;
    res.render('add-new-password', { title: 'Password Category List', loginUser:loginUser , msg:'',type:'',records:data });
  });
  
});


router.post('/add-new-password',checkLoginUser,[
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