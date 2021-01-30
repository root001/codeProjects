const express = require('express');
const { seedProducts, getProducts, getProductById, createProduct } = require('../controllers/productController');
const productRouter = express.Router();

/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
productRouter.get('/', getProducts);
/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
productRouter.get('/seed', seedProducts);
/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
productRouter.get('/:id', getProductById);
/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
productRouter.post('/create', createProduct);

module.exports = productRouter;