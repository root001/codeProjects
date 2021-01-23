const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { registerUser, authUser, verifyUserToken, getUserProfile } = require('../controllers/auth');
const { userValidationRules, validate } = require('../middleware/authReg-validator');
const authLogin = require('../middleware/authLogin-validator');

const router = express.Router();

router.post('/register', userValidationRules(), validate, registerUser);
router.post('/login', authLogin, authUser);
/**
 * @swagger
 * /verify:
 *  get:
 *      description: Used to verify user token code
 *      responses:
 *          '200':
 *              description: A successful response on valid token input, returning user data.
 */
router.post('/verify', verifyUserToken);
router.get('/me', protect, getUserProfile);

module.exports = router