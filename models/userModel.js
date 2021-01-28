const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

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
    secret: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true,
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};



userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
});

//Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
    // Generate token

    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set reset to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

userSchema.methods.getSignedJwtToken = function() {

    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

userSchema.virtual('tasks', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'user'
})

const User = mongoose.model('User', userSchema)

module.exports = User;