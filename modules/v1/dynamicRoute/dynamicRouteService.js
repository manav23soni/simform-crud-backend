const Model = require("../../../models/index");
const logger = require("../../../helper/logger");

const dynamicRouteService = {};

// Save dynamic route
dynamicRouteService.saveDynamicRoute = (routeDetails) => {
  return Model.routes.create(routeDetails);
};

// Edit dynamic roure
dynamicRouteService.editDynamicRoute = (routeDetails) => {
  return Model.routes.update(routeDetails, {
    where: {
      id: +routeDetails.id,
    },
  });
};

// Remove dynamic route
dynamicRouteService.removeDynamicRoute = (route) => {
  return Model.routes.destroy({
    where: {
      id: +route.id,
    },
  });
};

// Find dynamic route
dynamicRouteService.findRouteName = (route) => {
  return Model.routes.findOne({
    where: {
      routeName: route,
    },
  });
};

// Get all Routes
dynamicRouteService.getAllRoutes = (userId) => {
  return Model.routes.findAll({
    where: {
      userId: +userId,
    },
  });
};

// Get requested route
dynamicRouteService.getRouteById = (routeId) => {
  return Model.routes.findOne({
    where: {
      id: routeId,
    },
  });
};

module.exports = dynamicRouteService;
