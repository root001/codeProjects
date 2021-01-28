const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { registerUser, authUser, verifyUserToken, getUserProfile, testGenerator } = require('../controllers/auth');
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

/**
 * @swagger
 * /generate:
 *  get:
 *      description: Used to generate a secret key for 2FA validation
 *      responses:
 *          '200':
 *              description: A successful response on token generation, output of secret key (Base 32) and token code sent to user.
 */
router.get('/generate', testGenerator);

module.exports = router