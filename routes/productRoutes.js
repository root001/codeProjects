const express = require('express');
const { seedProducts, getProducts, getProductById, createProduct } = require('../controllers/productController');
const productRouter = express.Router();

productRouter.get('/', getProducts);

productRouter.get('/seed', seedProducts);

productRouter.get('/:id', getProductById);

productRouter.post('/create', createProduct);

module.exports = productRouter;