const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Model = require('../models/index');

module.exports = function(passport) {
    passport.use(
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
        },
        function (email, password, cb) {
            
          //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
            Model.users
            .findOne({  
              where: {
              email: email,
            }, })
            .then((user) => {
              if (!user) {
                return cb(null, false, { message: "Incorrect email or password." });
              }

              // Return if password is wrong
              bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                  return cb(err);
                }
                if (isMatch) {
                  return cb(null, user);
                } else {
                  return cb(null, false, {
                    message: "Password does not match",
                  });
                }
              });
            })
            .catch((err) => cb(err));
        }
      )
    );
}