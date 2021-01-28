const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    cartItem: [{
      name: {
        type: String
      },
      qty: { 
        type: Number, 
        default: 1 
      },
      price: { 
        type: Number, 
        required: true 
      },
      imagePath: {
        type: String,
        required: true
      }
    }],
    totalQty: {
      type: Number,
      default: 0,
      //required: true,
    },
    totalCost: {
      type: Number,
      default: 0
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