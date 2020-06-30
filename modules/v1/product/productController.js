const productService = require("./productService");
const logger = require("../../../helper/logger");
const utils = require("../../../helper/utils");

const { STANDARD, ERROR500, ERROR401 } = require("../../../constants/common");

const productCtr = {};

/**
 * Name - Add product into products table
 * API route - /v1/product/
 * Method - POST
 * Body Parameters - {
        "productName": "Product Name",
        "type": "Product Type",
        "description": "Product Decription"
    }
 * Response - returns success with data
 */
productCtr.addUserProducts = async (req, res) => {
  try {
    const { body: productDetails } = req;
    const { id } = req.authUserDetails;
    const addProduct = await productService.addProduct({
      ...productDetails,
      userId: id,
    });
    if (addProduct) {
      return res.status(STANDARD.SUCCESS).json({
        message: req.t("MSG_ADD_SUCCESS"),
        data: addProduct || {},
        code: STANDARD.SUCCESS,
        path: req.originalUrl,
        method: req.method
      });
    }
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  } catch (error) {
    logger.error("[ERROR] From Main add product API catch", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

/**
 * Name - Edit product into products table
 * API route - /v1/product/
 * Method - put
 * Body Parameters - {
        "id": 1,
        "productName": "Product Name",
        "type": "Product Type",
        "description": "Product Decription"
    }
 * Response - returns success
 */
productCtr.editUserProducts = async (req, res) => {
  try {
    const { body: productDetails } = req;
    const { id } = req.authUserDetails;

    const editProduct = await productService.editProduct({
      ...productDetails,
      userId: id,
    });
    if (editProduct) {
      return res.status(STANDARD.SUCCESS).json({
        message: req.t("MSG_UPDATE_SUCCESS"),
        code: STANDARD.SUCCESS,
        path: req.originalUrl,
        method: req.method
      });
    }
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  } catch (error) {
    logger.error("[ERROR] From Main edit product API catch", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

/**
 * Name - Delete product from products table
 * API route - /v1/product/
 * Method - delete
 * Body Parameters - {
        "id": 1
    }
 * Response - returns success
 */
productCtr.removeUserProductById = async (req, res) => {
  try {
    const { params: productId } = req;

    await productService.removeProduct(productId);

    return res.status(STANDARD.SUCCESS).json({
      message: req.t("MSG_REMOVED_SUCCESS"),
      code: STANDARD.SUCCESS,
      path: req.originalUrl,
      method: req.method
    });
  } catch (error) {
    logger.error("[ERROR] From Main delete product API catch", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

/**
 * Name - Get all login user product from products table (with pagination)
 * API route - /v1/product/:pageNo
 * Method - get
 * params - "pageNo"
 * Response - returns success and data
 */
productCtr.getAllUserProduct = async (req, res) => {
  try {
    const { pageNo } = req.params;
    const { id } = req.authUserDetails;
    let limit = +process.env.MAX_RECORDS;
    let pg = 0;

    if (utils.isDefined(req.body.pageNo) && parseInt(req.body.pageNo) > 1) {
      pg = parseInt(pageNo - 1) * limit;
    }
    const getTotalCount = await productService.getTotalProductCount(id);
    const getAllProduct = await productService.getAllProduct(id, pageNo, limit);

    let pages = Math.ceil(getTotalCount / limit);
    let pagination = {
      pages: pages ? pages : 1,
      total: getTotalCount,
      max: limit,
    };
    if (getAllProduct.length > 0) {
      return res.status(STANDARD.SUCCESS).json({
        message: req.t("SUCCESS"),
        data: getAllProduct || [],
        pagination: pagination,
        code: STANDARD.SUCCESS,
        path: req.originalUrl,
        method: req.method
      });
    } else {
      return res.status(STANDARD.SUCCESS).json({
        message: req.t("SUCCESS"),
        data: [],
        pagination: pagination,
        code: STANDARD.SUCCESS,
        path: req.originalUrl,
        method: req.method
      });
    }
  } catch (error) {
    logger.error("[ERROR] From Main get product API catch", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

/**
 * Name - Get product by id from products table
 * API route - /v1/product/get/:productId
 * Method - get
 * params - "productId"
 * Response - returns success and data
 */
productCtr.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const getProductById = await productService.getProductById(productId);

    if (getProductById) {
      return res.status(STANDARD.SUCCESS).json({
        message: req.t("SUCCESS"),
        data: getProductById,
        code: STANDARD.SUCCESS,
        path: req.originalUrl,
      });
    } else {
      return res.status(ERROR400.CODE).json({
        error: req.t("ERROR_PRODUCT_NOT_FOUND"),
        code: ERROR400.CODE,
      });
    }
  } catch (error) {
    logger.error("[ERROR] From Main get product by Id API catch", error);
    return res.status(ERROR500.CODE).json({
      error: req.t("TRY_AGAIN"),
      code: ERROR500.CODE,
    });
  }
};

module.exports = productCtr;
