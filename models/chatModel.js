const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const chatSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat;