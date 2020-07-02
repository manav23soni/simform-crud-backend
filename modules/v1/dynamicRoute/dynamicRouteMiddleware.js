const l10n = require("jm-ez-l10n");
const { check } = require("express-validator");
const utils = require("../../../helper/utils");
const dynamicRouteService = require("./dynamicRouteService");
const logger = require("../../../helper/logger");
const {
  ERROR422,
  ERROR500,
  ERROR400,
  ERROR401,
} = require("../../../constants/common");

const middleware = {};
// Check require parameters
middleware.dynamicRouteValidator = () => {
  return [
    check("routeName", l10n.t("ERROR_ROUTE_NAME_REQUIRED")).exists({
      checkFalsy: true,
    }),
    check("parameters", l10n.t("ERROR_ROUTE_PARAMETER_REQUIRED")).exists({
      checkFalsy: true,
    }),
  ];
};

// Check dynamic route valid or not
middleware.checkRouteUrl = async (req, res, next) => {
  try {
    const { routeName } = req.params;
    const routeDetails = await dynamicRouteService.findRouteName(routeName);
    if (routeDetails) {
      // Found Route
      req.routeDetails = routeDetails;
      return next();
    } else {
      // Not Found
      return res.status(ERROR400.CODE).json({
        error: req.t("BAD_REQUEST"),
        code: ERROR400.CODE,
      });
    }
  } catch (error) {
    logger.error("[ERROR] From Main add dynamic route API catch", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

// Check duplicate routes
middleware.checkDuplicateRouteName = async (req, res, next) => {
  try {
    const { body: routeDetails } = req;
    const { id } = req.authUserDetails;
    const findRouteName = await dynamicRouteService.findRouteName(routeDetails.routeName);
    if (findRouteName) {
      // Check duplicate for same user
      if (findRouteName.userId === id && req.method === "POST") {
        return res.status(ERROR400.CODE).json({
          error: req.t("ROUTE_ALREADY_EXIST"),
          code: ERROR400.CODE,
        });
        // check duplicate for same user but different routes
      } else if (findRouteName.userId === id && req.method === "PUT" && findRouteName.id !== routeDetails.id) {
        return res.status(ERROR400.CODE).json({
          error: req.t("ROUTE_ALREADY_EXIST"),
          code: ERROR400.CODE,
        });
      } else {
        return next();
      }
    } else {
      // Unique Route
      return next();
    }
  } catch (error) {
    logger.error("[ERROR] From Main add dynamic route API catch", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

// Check parameter validation for requedted route
middleware.checkValidation = (req, res, next) => {
  const { body: bodyParameters } = req;
  const routeParameters = JSON.parse(req.routeDetails.parameters);
  let requireValidations = [];
  // Here we are comparing DB parameters with Body parameters
  if (!utils.isEmpty(bodyParameters)) {
    requireValidations = Object.keys(bodyParameters);
    for (let i = 0; i < routeParameters.length; i++) {
      // Check body parameter is found in DB configure parameter
      let findIndex = requireValidations.findIndex(
        (x) => x === routeParameters[i].field
      );
      if (findIndex === -1) {
        // Error for require parameter
        return res.status(ERROR422).json({
          error: `Please enter ${routeParameters[i].field}`,
          code: ERROR422,
        });
      } else {
        continue;
      }
    }
  } else {
    return res.status(ERROR422).json({
      error: `Please enter ${routeParameters[0].field}`,
      code: ERROR422,
    });
  }
  return next();
};

// check user accesss
middleware.checkRouteUser = async (req, res, next) => {
  try {
    const { id } = req.authUserDetails;
    const routeDetails = await dynamicRouteService.getRouteById(req.params.id);
    if (routeDetails) {
      // Check login user and route access user same or not
      if (id === routeDetails.userId) {
        return next();
      } else {
        // If not than throw permission error
        return res.status(ERROR401.CODE).json({
          error: req.t("PERMISSION_ERROR"),
          code: ERROR401.CODE,
        });
      }
    } else {
      return res.status(ERROR401.CODE).json({
        error: req.t("ERROR_ROUTE_NOT_FOUND"),
        code: ERROR400.CODE,
      });
    }
  } catch (error) {
    logger.error("Error From checkProductUser() in productMiddleware", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

module.exports = middleware;
