const express = require('express');
const router = express.Router();

const Users = require('../dev-data/data/UsersData');

/**
 * @swagger
 * /api/admin:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get('/', (req, res) => res.json(Users));

/**
 * @swagger
 * /api/admin:
 *  put:
 *      description: Use to create a user
 *      responses:
 *          '201':
 *              description: A successful response
 */
router.put('/', (req, res) => {
    res.status(200).send("Successfully Created admin user");
});

module.exports = router;