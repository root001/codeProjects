const Product = require('../models/productModel.js');
const productData = require("../dev-data/data/productData.js");
const expressAsyncHandler = require('express-async-handler');

const seedProducts = expressAsyncHandler(async (req, res) => {
    //await Product.remove({})
    const createdProducts = await Product.insertMany(productData.products);
    res.status(200).send(createdProducts);
})

const getProducts = expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.status(200).send(products);
});

const getProductById = expressAsyncHandler(async (req, res) => {
  const _id = req.params.id;
    const product = await Product.findById(_id);
    if (product) {
        res.status(200).send(product)
    } else {
        res.status(404).send({ message: 'Product Not Found' })
    }
})

const createProduct = expressAsyncHandler(async (req, res) => {
    const product = new Product(req.body);
    const createdProduct = await product.save()
    res.status(201).send(createdProduct)
})

module.exports = {
    seedProducts,
    getProducts,
    getProductById,
    createProduct
}