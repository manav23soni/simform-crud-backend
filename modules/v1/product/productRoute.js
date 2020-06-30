const express = require("express");
const productCtr = require("./productController");
const productMiddleware = require("./productMiddleware");
const auth = require("../../../helper/auth");
const { validationHandler } = require("../../../helper/validate");

const productRouter = express.Router();

const productAddMiddlewares = [
  productMiddleware.productValidator(),
  validationHandler,
  auth.isAuthenticatedUser,
  productCtr.addUserProducts,
];
productRouter.post("/", productAddMiddlewares);

const productEditMiddlewares = [
  productMiddleware.productEditValidator(),
  validationHandler,
  auth.isAuthenticatedUser,
  productMiddleware.checkProductUser,
  productCtr.editUserProducts,
];
productRouter.put("/", productEditMiddlewares);

const productDeleteMiddlewares = [
  auth.isAuthenticatedUser,
  productMiddleware.checkProductUser,
  productCtr.removeUserProductById,
];
productRouter.delete("/:productId", productDeleteMiddlewares);

const productGetMiddlewares = [
  auth.isAuthenticatedUser,
  productCtr.getAllUserProduct,
];
productRouter.get("/:pageNo", productGetMiddlewares);

const productGetByIdMiddlewares = [
  auth.isAuthenticatedUser,
  productCtr.getProductById,
];
productRouter.get("/get/:productId", productGetByIdMiddlewares);

module.exports = productRouter;
