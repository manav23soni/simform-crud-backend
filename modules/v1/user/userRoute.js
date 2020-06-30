const express = require('express');
const userCtr = require('./userController');
const userMiddleware = require('./userMiddleware');
const auth = require('../../../helper/auth');
const { validationHandler } = require('../../../helper/validate');

const userRouter = express.Router();

// User SignUp
const userSignUpMiddlewares = [
  userMiddleware.userSignUpValidator(),
  validationHandler,
  userMiddleware.isEmailIdExistsOrNot,
  userCtr.signUp,
];
userRouter.post('/signup', userSignUpMiddlewares);

// User Login
const userLoginMiddlewares = [
  userMiddleware.userLoginValidator(),
  validationHandler,
  userCtr.login,
];
userRouter.post('/login', userLoginMiddlewares);

module.exports = userRouter;
