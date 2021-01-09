const express = require("express");
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;

//mongoDb connection string
const dbURI = 'mongodb+srv://dbadmin:pa55w0rd1@ecommerce.al6d0.mongodb.net/ecommerceDb?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));

//Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Customer API',
            description: 'Customer API information',
            contact: {
                name: "Code project"
            },
            servers: ["http://localhost:5000"]
        }
    },
    //['.routes/*.js']
    apis: ["app.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//ROUTES
/**
 * @swagger
 * /customers:
 *  get:
 *      description: Use to request all customers
 *      responses:
 *          '200':
 *              description: A successful response
 */
app.get('/customers', (req, res) => {
    console.log("getting req");
    res.status(200).send("Fetched Customer results");
});

/**
 * @swagger
 * /customer:
 *  put:
 *      description: Use to create a customer
 *      responses:
 *          '201':
 *              description: A successful response
 */
app.put('/customer', (req, res) => {
    res.status(200).send("Successfully Created customer");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}....`);
});