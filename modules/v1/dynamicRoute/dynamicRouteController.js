const dynamicRouteService = require("./dynamicRouteService");
const logger = require("../../../helper/logger");
const utils = require("../../../helper/utils");

const { STANDARD, ERROR500 } = require("../../../constants/common");

const dynamicRouteCtr = {};

/**
 * Name - Add routes into routes table
 * API route - /v1/
 * Method - POST
 * Body Parameters - {
    "type": "post",
    "routeName": "add-user",
    "parameters": [ { "field": "name" }, { "field": "description" } ]
}
 * Response - returns success with data
 */
dynamicRouteCtr.saveDynamicRoutes = async (req, res) => {
  try {
    const { body: dynamicRouteDetails } = req;
    const { id } = req.authUserDetails;
    dynamicRouteDetails.parameters = JSON.stringify(
      dynamicRouteDetails.parameters
    );
    const saveDynamicRoute = await dynamicRouteService.saveDynamicRoute({
      ...dynamicRouteDetails,
      userId: id,
    });
    if (saveDynamicRoute) {
      return res.status(STANDARD.SUCCESS).json({
        message: req.t("SUCCESS"),
        data: saveDynamicRoute || {},
        code: STANDARD.SUCCESS,
        path: req.originalUrl,
        method: req.method,
      });
    }
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  } catch (error) {
    logger.error("[ERROR] From Main add dynamic route API catch", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

/**
 * Name - Find a valid route and check require parameters
 * API route - /v1/:routeName
 * Method - POST
 * Body Parameters - {
      // add parameters that you configure when route create
   }
 * Response - returns success with data
 */
dynamicRouteCtr.findRouteAndValidate = (req, res) => {
  try {
    const { body: parameters } = req;
    const { routeDetails } = req;
    if (routeDetails) {
      return res.status(STANDARD.SUCCESS).json({
        message: req.t("SUCCESS"),
        code: STANDARD.SUCCESS,
        data: parameters,
        path: req.url,
        method: req.method,
      });
    }
  } catch (error) {
    logger.error("[ERROR] From Main find dynamic route API catch", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

/**
 * Name - Edit routes into routes table
 * API route - /v1/
 * Method - PUT
 * Body Parameters - {
    "type": "post",
    "routeName": "add-user",
    "parameters": [ { "field": "name" }, { "field": "description" } ]
}
 * Response - returns success
 */
dynamicRouteCtr.editDynamicRoute = async (req, res) => {
  try {
    const { body: dynamicRouteDetails } = req;
    const { id } = req.authUserDetails;
    dynamicRouteDetails.parameters = JSON.stringify(
      dynamicRouteDetails.parameters
    );
    const editDynamicRoute = await dynamicRouteService.editDynamicRoute({
      ...dynamicRouteDetails,
      userId: id,
    });
    return res.status(STANDARD.SUCCESS).json({
      message: req.t("SUCCESS"),
      code: STANDARD.SUCCESS,
      path: req.originalUrl,
      method: req.method,
    });
  } catch (error) {
    logger.error("[ERROR] From Main edit dynamic route API catch", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

/**
 * Name - Delete routes into routes table
 * API route - /v1/:id
 * Method - DELETE
 * Response - returns success
 */
dynamicRouteCtr.deleteDynamicRoute = async (req, res) => {
  try {
    const { params: routeId } = req;
    await dynamicRouteService.removeDynamicRoute(routeId);
    return res.status(STANDARD.SUCCESS).json({
      message: req.t("MSG_REMOVED_SUCCESS"),
      code: STANDARD.SUCCESS,
      path: req.originalUrl,
      method: req.method,
    });
  } catch (error) {
    logger.error("[ERROR] From Main delete dynamic route API catch", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

/**
 * Name - Get all routes to specific login user from routes table
 * API route - /v1/getAll
 * Method - GET
 * Response - returns success with data
 */
dynamicRouteCtr.getAllDynamicRoutes = async (req, res) => {
  try {
    const { id } = req.authUserDetails;
    const getAllRoutes = await dynamicRouteService.getAllRoutes(id);
    if (getAllRoutes.length > 0) {
      return res.status(STANDARD.SUCCESS).json({
        message: req.t("SUCCESS"),
        data: getAllRoutes || [],
        code: STANDARD.SUCCESS,
        path: req.originalUrl,
        method: req.method,
      });
    } else {
      return res.status(STANDARD.SUCCESS).json({
        message: req.t("SUCCESS"),
        data: [],
        code: STANDARD.SUCCESS,
        path: req.originalUrl,
        method: req.method,
      });
    }
  } catch (error) {
    logger.error("[ERROR] From Main get dynamic route API catch", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

/**
 * Name - Add routes into routes table
 * API route - /v1/getSingle/:id
 * Method - GET
 * Response - returns success with data
 */
dynamicRouteCtr.getDynamicRouteById = async (req, res) => {
  try {
    const {id} = req.params;
    const getRouteById = await dynamicRouteService.getRouteById(id);
    if (getRouteById) {
      return res.status(STANDARD.SUCCESS).json({
        message: req.t("SUCCESS"),
        data: getRouteById,
        code: STANDARD.SUCCESS,
        path: req.originalUrl,
      });
    } else {
      return res.status(ERROR400.CODE).json({
        error: req.t("ERROR_ROUTE_NOT_FOUND"),
        code: ERROR400.CODE,
      });
    }
  } catch (error) {
    logger.error("[ERROR] From Main get route by Id API catch", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

module.exports = dynamicRouteCtr;
