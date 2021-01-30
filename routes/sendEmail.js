const express = require('express');
const router = express.Router();
const EmailSender = require('../utils/email');



/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get('/send', (req, res) => {
    EmailSender;
    res.status(200).send("Mail sent successfully");
});


module.exports = router;