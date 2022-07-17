var userModule = require('../modules/user');
var indexRouter = require('../routes/index');



function checkLoginUser(req,res,next){
    var userToken=localStorage.getItem('userToken');
    try {
      var decoded = jwt.verify(userToken, 'loginToken');
    } catch(err) {
      res.redirect('/');
    }
    next();
  }

module.exports = {
    checkLoginUser:checkLoginUser,
};