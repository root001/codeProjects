const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const speakeasy = require('speakeasy');
const sendEmail = require('../utils/email');

const User = require('../models/userModel');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ errors: [{ msg: "Please enter a valid email and password" }] });
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        //currently acting as a placeholder check for is2FAEnabled - boolean 
        if (user.isAdmin) {
            const generatedSecret = speakeasy.generateSecret();
            const message = `Your authetication token is ${generatedSecret.body.token}.`;

            user.secret = generatedSecret.base32;
            await User.save({ validateBeforeSave: false });
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Your password reset token (valid for 10 min)',
                    message,
                });

                res.status(200).json({
                    status: 'success',
                    message: 'Token sent to email!',
                });
            } catch (err) {
                return res.status(500).json({ errors: [{ msg: "There was an error sending the email." }] });
            }
        } else {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            })
        }
    } else {
        return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
});

const generatedToken = (generatedSecret) => {
    const token = speakeasy.totp({ secret: generatedSecret.base32, encoding: 'base32' });
    return token
}

const testGenerator = asyncHandler(async(req, res) => {
    const generatedSecret = speakeasy.generateSecret();
    const tokenCode = generatedToken(generatedSecret);
    res.json(
        `Your authetication token is ${generatedSecret.hex}. And the token code is ${tokenCode}`
    );
});

const verifyUserToken = asyncHandler(async(req, res) => {
    // pulling id/email and token code from request to validate
    const token = req.body.token;
    const userEmail = req.body.email;
    const user = await User.findOne({ userEmail });

    const verified = speakeasy.totp.verify({
        secret: user.secret.base32,
        encoding: 'base32',
        token
    });
    if (verified == "true") {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        return res.status(400).json({ errors: [{ msg: "Invalid Token code." }] });
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        return res.status(400).json({ errors: [{ msg: "User not found" }] });
    }
})


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password, phone } = req.body

    const userExists = await User.findOne({ email, phone })

    if (userExists) {
        return res.status(400).json({ errors: [{ msg: "User with email or phone number already exists" }] });
    }

    const user = await User.create({
        phone,
        name,
        email,
        password,
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
});


module.exports = {
    authUser,
    verifyUserToken,
    getUserProfile,
    registerUser,
    testGenerator
}