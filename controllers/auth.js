const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken');

const User = require('../models/userModel');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if(!email || !password ) {
    return res.status(400).json({ errors: [{ msg: "Please enter a valid email and password"}] });
  }

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    return res.status(400).json({ errors: [{ msg: "Invalid Credentials"}] });
  }
});



// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    return res.status(400).json({ errors: [{ msg: "User not found"}] });
  }
})


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone} = req.body

  const userExists = await User.findOne({ email, phone })

  if (userExists) {
    return res.status(400).json({ errors: [{ msg: "User with email or phone number already exists"}] });
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
  getUserProfile,
  registerUser
}
