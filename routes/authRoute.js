const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { registerUser, authUser, verifyUserToken, getUserProfile } = require('../controllers/auth');
const { userValidationRules, validate } = require('../middleware/authReg-validator');
const authLogin = require('../middleware/authLogin-validator');

const router = express.Router();

router.post('/register', userValidationRules(), validate, registerUser);
router.post('/login', authLogin, authUser);
router.post('/verify', verifyUserToken);
router.get('/me', protect, getUserProfile);

module.exports = router