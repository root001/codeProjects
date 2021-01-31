const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    registerUser,
    authUser,
    verifyUserToken,
    getUserProfile,
    forgotPassword,
    logout,
    updatePassword,
    updateDetails,
    resetPassword
} = require('../controllers/auth');
const { userValidationRules, validate } = require('../middleware/authReg-validator');
const authLogin = require('../middleware/authLogin-validator');
const router = express.Router();

/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.post('/register', userValidationRules(), validate, registerUser);
/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.post('/login', authLogin, authUser);
/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get('/logout', logout);
/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.post('/forgotpassword', forgotPassword);
/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.put('/resetpassword/:resettoken', resetPassword);
/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.put('/updatedetails', protect, updateDetails);
/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.put('/updatepassword', protect, updatePassword);
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
/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get('/me', protect, getUserProfile);

module.exports = router