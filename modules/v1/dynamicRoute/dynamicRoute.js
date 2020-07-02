const express = require("express");
const dynamicRouteCtr = require("./dynamicRouteController");
const dynamicRouteMiddleware = require("./dynamicRouteMiddleware");
const auth = require("../../../helper/auth");
const { validationHandler } = require("../../../helper/validate");

const dynamicRoute = express.Router();

// Save dynamic route
const dynamicRouteMiddlewares = [
  dynamicRouteMiddleware.dynamicRouteValidator(), // check validation
  validationHandler,
  auth.isAuthenticatedUser, // check user authentication
  dynamicRouteMiddleware.checkDuplicateRouteName, // check duplicate route
  dynamicRouteCtr.saveDynamicRoutes, // save dynamic route
];
dynamicRoute.post("/", dynamicRouteMiddlewares);

// check dynamic requested route
const dynamicRoutechaeckMiddlewares = [
  dynamicRouteMiddleware.checkRouteUrl, // check requested routed valid or not
  dynamicRouteMiddleware.checkValidation, // check parameter validation
  dynamicRouteCtr.findRouteAndValidate
];
dynamicRoute.post("/:routeName", dynamicRoutechaeckMiddlewares);

// Edit dynamic route
const dynamicRouteEditMiddlewares = [
  dynamicRouteMiddleware.dynamicRouteValidator(), // check validation
  validationHandler,
  auth.isAuthenticatedUser, // check user authentication
  dynamicRouteMiddleware.checkDuplicateRouteName,  // check duplicate route
  dynamicRouteCtr.editDynamicRoute, // Edit route
];
dynamicRoute.put("/", dynamicRouteEditMiddlewares);

// Delete Dynamic route
const dynamicRouteDeleteMiddlewares = [
  auth.isAuthenticatedUser, // check user authentication
  dynamicRouteMiddleware.checkRouteUser, // check user access
  dynamicRouteCtr.deleteDynamicRoute // delete route
];
dynamicRoute.delete("/:id", dynamicRouteDeleteMiddlewares);

// Get all routes
const dynamicRouteGetMiddlewares = [
  auth.isAuthenticatedUser, // check user authentication
  dynamicRouteCtr.getAllDynamicRoutes // get all route
];
dynamicRoute.get("/getAll", dynamicRouteGetMiddlewares);

// Get requested route
const dynamicRouteGetSingleMiddlewares = [
  auth.isAuthenticatedUser, // check user authentication
  dynamicRouteCtr.getDynamicRouteById // get single route
];
dynamicRoute.get("/getSingle/:id", dynamicRouteGetSingleMiddlewares);


module.exports = dynamicRoute;
