const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const sendEmail = require('../utils/email');

const User = require('../models/userModel');


const generatedToken = (generatedSecret) => {
    const token = speakeasy.totp({ secret: generatedSecret.base32, encoding: 'base32' });
    return token
}

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
            const tokenCode = generatedToken(generatedSecret);
            const message = `Your authetication token is ${tokenCode}.`;

            user.secret = generatedSecret.base32;
            await User.save({ validateBeforeSave: false });
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Your password reset token (valid for 30 seconds)',
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


const verifyUserToken = asyncHandler(async(req, res) => {
    const token = req.body.token;
    const id = req.body.id;
    const user = await User.findOne({ id });

    const verified = speakeasy.totp.verify({
        secret: user.secret,
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


//////////////////////

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {

        options.httpOnly = true;

    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user
        })
};




//@desc   Forgot password
//@route  POST  /api/v1.0.0/auth/forgotpassword
//@access Public

const forgotPassword = asyncHandler(async(req, res, next) => {

    const user = await User.findById({ email: req.body.email });

    if (!user) {
        return res.status(400).json({ errors: [{ msg: "User not found" }] });
    }


    //Get reset token
    const resetToken = user.getResetPasswordToken();


    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1.0.0/auth/resetpassword/${resetToken}`;


    const message = `You are receiving this email because you have request for a password reset, please make a PUT request to: \n\n ${resetUrl}`;

    try {

        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });

        return res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ errors: [{ msg: "Email could not be sent" }] });
    }
});



//@desc       Reset password
//@route      POST /api/v1.0.0/auth/resetpassword/:resettoken
//@access     Public

const resetPassword = asyncHandler(async(req, res) => {

    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });


    if (!user) {
        return res.status(400).json({ errors: [{ msg: "Invalid token" }] });
    }

    //Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
});



//@desc      Update users details
//@route      PUT /api/v1.0.0/auth/updatedetails
//@access     PRIVATE
const updateDetails = asyncHandler(async(req, res, next) => {

    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })
});



//@desc       Update password
//@route      PUT /api/v1.0.0/auth/updatepassword
//@access     PRIVATE
const updatePassword = asyncHandler(async(req, res, next) => {

    const user = await User.findById(req.user.id).select('+password')

    // check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return res.status(401).json({ errors: [{ msg: "Password is incorrect" }] });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});




//@desc   Log user out / clear cookie
//@route  GET  /api/v1.0.0/auth/logout
//@access private
const logout = asyncHandler(async(req, res, next) => {

    res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });


    res.status(200).json({
        success: true,
        data: {}
    });
});


module.exports = {
    authUser,
    verifyUserToken,
    getUserProfile,
    registerUser,
    forgotPassword,
    logout,
    updatePassword,
    updateDetails,
    resetPassword
}