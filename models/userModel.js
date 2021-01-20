const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        trim: ' ',
        minlength: 5,
        maxlength: 100,
        required: [true, 'Please add a valid email address'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },

    phone: {
        type: String,
        required: true,
        unique: true,
        trim: '',
        minlength: 10,
        maxlength: 30,
    },

    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 8,
        select: false,
        match: [
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
            'password must contain at least one digit, one lower case, one upper case'
        ]
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true,
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

module.exports = User;