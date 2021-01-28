const expressAsyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel')
const tempUsersData = require('../dev-data/data/tempUserData');

const addToCart = expressAsyncHandler(async (req, res) => {
    const _id = req.params.p_id;
    if (req.user) {
        const existingCartProduct = Cart.findOne({ _id });
        if (existingCartProduct) {
            const cartProd = {
                cartItem: {
                    _id: existingCartProduct.cartItem._id,
                    name: existingCartProduct.cartItem.name,
                    qty: existingCartProduct.cartItem.qty =+ 1,
                    price: existingCartProduct.cartItem.price,
                    imagePath: existingCartProduct.cartItem.imagePath
                },
                totalQty: existingCartProduct.totalQty += 1,
                totalCost: existingCartProduct.totalCost += cartItem.price,
                user: req.user._id
            }
            const cart = new Cart(cartProd);
            const savedCart = await cart.save()
            res.status(201).send(savedCart)
        } else {
            const existingProduct = Product.findOne({_id});
            if (existingProduct) {
                const newCartProd = {
                    cartItem: {
                        _id: existingProduct._id,
                        name: existingProduct.name,
                        qty: 1,
                        price: existingProduct.price,
                        imagePath: existingProduct.imagePath
                    },
                    totalQty: existingCartProduct.totalQty += 1,
                    totalCost: existingCartProduct.totalCost += cartItem.price,
                    user: req.user._id
                }
                const cart = new Cart(newCartProd);
                const savedCart = await cart.save();
                res.status(201).send(savedCart);
            } else {
                res.status(404).send('product does not exist');
            }
        }
        const cart = new Cart()
        await cart.save()
    } else {
        res.redirect('./login')
    }
})

const getCart = expressAsyncHandler(async (req, res) => {
    //const carts = await Cart.findOne({_id: product_id, user: req.user._id  })
    const user = req.user;
    await user.populate('carts').execPopulate()
    res.status(200).send(user.carts)
})

const deleteCartItem = expressAsyncHandler(async (req, res) => {
    let product_id = req.params.id;
    const deletedCartItem = await Cart.findByIdAndDelete({_id: product_id})
    //const deletedCartItem = await cart.remove()
    res.status(200).send('item has been deleted');
}) 

const emptyCart = expressAsyncHandler(async (req, res) => {
    await Cart.deleteMany({user: req.user._id})
})

const seedCart = expressAsyncHandler(async (req, res) => {
    // await Cart.remove({})
    const seededUsers = await User.insertMany(tempUsersData.users);
    res.status(200).send(seededUsers);
})

module.exports = {
    addToCart,
    getCart,
    deleteCartItem,
    emptyCart,
    seedCart
}