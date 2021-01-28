const express = require('express');
const cartRouter = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addToCart, getCart, emptyCart, seedCart, deleteCartItem } = require('../controllers/cart')

cartRouter.get('/seed', seedCart);

cartRouter.post('/', protect, addToCart);

cartRouter.get('/', protect, getCart);

cartRouter.delete('/delete-item/:id', protect, deleteCartItem);

cartRouter.delete('/emptycart', protect, emptyCart);

module.exports = cartRouter;