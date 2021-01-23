const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    cartItems: [
      {
        name: {
          type: String
        },
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product', required: true 
        },
        quantity: { 
          type: Number, 
          default: 1 },
        price: { 
          type: Number, 
          required: true 
        }
      }
    ],
    totalQty: {
      type: Number,
      default: 0,
      required: true,
    },
    totalCost: {
      type: Number,
      default: 0,
      required: true,
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
}, { 
      timestamps: true 
});


module.exports = mongoose.model('Cart', cartSchema);