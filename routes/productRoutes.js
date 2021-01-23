const express = require('express');
const productRouter = express.Router();
const Product = require('../models/productModel.js');
const productData = require("../dev-data/data/productData.js")
const expressAsyncHandler = require('express-async-handler');

productRouter.get('/', expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.status(200).send(products);
}));

productRouter.get('/seed', expressAsyncHandler(async (req, res) => {
    //await Product.remove({})
    const createdProducts = await Product.insertMany(productData.products);
    res.status(200).send(createdProducts);
}));

productRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const product = Product.findById(req.params.id);
    if (product) {
        res.status(200).send(product)
    } else {
        res.status(404).send({ message: 'Product Not Found' })
    }
}))

export default productRouter;