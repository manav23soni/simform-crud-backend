const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const userService = require("./userService");
const logger = require("../../../helper/logger");

const { STANDARD, ERROR500, ERROR401 } = require("../../../constants/common");

const userCtr = {};

/**
 * Name - Sign up for new user request
 * API route - /v1/user/signup
 * Method - POST
 * Body Parameters - {
        "name": "User Name",
        "email": "User Email",
        "password": "*******"
    }
 * Response - returns success with data and token
 */
userCtr.signUp = async (req, res) => {
  try {
    if (req.body) {
      const { password } = req.body;
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND, 10));
      const encPassword = await bcrypt.hash(password, salt);
      req.body.password = encPassword;
    }
    // Add User
    const result = await userService.addUser(req.body);
    let token = "";
    if (result && result.dataValues) {
      // Generate JWT token.
      token = jwt.sign(
        {
          userId: result.id,
        },
        process.env.PRIVATE_KEY
      );
      delete result.dataValues.password;
    }
    return res.status(STANDARD.SUCCESS).json({
      message: req.t("SUCCESS"),
      data: result || {},
      token: token,
      code: STANDARD.SUCCESS,
      path: req.url
    });
  } catch (err) {
    logger.error("[ERROR] From Main signUp API catch", err);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

/**
 * Name - SignIn request (here we are authenticate user with passport)
 * API route - /v1/user/login
 * Method - POST
 * Body Parameters - {
        "email": "User Email",
        "password": "*******"
    }
 * Response - returns success with data and token
 */
userCtr.login = async (req, res) => {
  try {
    passport.authenticate("local", (err, user, info) => {
      let token;
      // If Passport throws/catches an error
      if (err) {
        logger.error("[ERROR] From Main Login API catch", err);
        return res.status(ERROR500.CODE).json({
          error: req.t("TRY_AGAIN"),
          code: ERROR500.CODE,
        });
      }
      // Generate JWT token.
      token = jwt.sign(
        {
          userId: user.id,
        },
        process.env.PRIVATE_KEY
      );
      // If a user is found
      if (user) {
        delete user.password;
        return res.status(STANDARD.SUCCESS).json({
          message: req.t("MSG_LOGIN_SUCCESS"),
          data: user || {},
          token: token,
          code: STANDARD.SUCCESS,
          path: req.url
        });
      } else {
        // If user is not found
        return res.status(ERROR401.CODE).json({
          error: info.message,
          code: ERROR401.CODE,
        });
      }
    })(req, res);
  } catch (err) {
    logger.error("[ERROR] From Main Login API catch", err);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

module.exports = userCtr;
