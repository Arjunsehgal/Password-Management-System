var userModule = require('../modules/user');
var userModule = require('../modules/user');

var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var jwt = require ('jsonwebtoken');

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

module.exports = {
    checkLoginUser:checkLoginUser,
};