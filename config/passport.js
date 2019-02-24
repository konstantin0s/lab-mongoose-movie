const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const expressValidator = require('express-validator');
const passport = require('passport');

module.exports = (passport) => {

  //Local Strategy
  passport.use(new LocalStrategy((username, password, done) => {
    //match username
    let query = {username: username};
    User.findOne(query, (error, user) => {
      if (error) throw error;
      if (!user) {
        return done(null, false, {message: "No user found"});
      }

      //match password
      bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) throw error;
        if (isMatch) {
          return done(null, user); 
        } else {
          return done(null, false, {message: "No user found"});
        }
      });
    })
  }));
 
  //serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id)
  });

  //deserialize
  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  })



}


