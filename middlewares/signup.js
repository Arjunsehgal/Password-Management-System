var userModule = require('../modules/user');

function checkEmail(req,res,next){
    var email = req.body.email;
    var checkExistEmail = userModule.findOne({email:email});
    checkExistEmail.exec((err,data)=>{
        if(err) throw err;
        if(data){
        return res.render('signup', { title: 'Password Management System' , msg:'Email Already Exist',type:'fail'});
        }
        next();
});

};

function checkUserName(req,res,next){
    var username = req.body.uname;
    var checkExistUserName = userModule.findOne({username:username});
    checkExistUserName.exec((err,data)=>{
        if(err) throw err;
        if(data){
        return res.render('signup', { title: 'Password Management System' , msg:'UserName Already Exist',type:'fail'});
         
        }
        next();
});

}

module.exports = {
    checkEmail:checkEmail,
    checkUserName:checkUserName,
};