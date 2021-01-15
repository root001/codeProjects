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

//Body Parser; reading the data from the body to req.body(max 15kb)
app.use(express.json({ limit: '15kb' }));

//GLOBAL ERROR HANDLER MIDDLEWARE

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
    apis: ['.routes/*.js']
        //apis: ["app.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//ROUTES
//app.use('/api/admin', require('./routes/userRoutes'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}....`);
});