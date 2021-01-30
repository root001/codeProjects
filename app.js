const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const logger = require('./utils/winston-logger');
const fs = require('fs');
const mongoSanitize = require('express-mongo-sanitize');
const setResHeaders = require('./middleware/headers-middleware');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const hpp = require('hpp');
const connectDB = require('./configs/mongodb-config');
const colors = require('colors');

//Route files
const authRoute = require('./routes/authRoute')

//load env vars
dotenv.config();

//initate Database connection.
connectDB()

const app = express();

app.use(express.json());

//set response header
app.use(setResHeaders);

//swagger 
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'E-Commerce Backend API',
            description: 'E-Commerce API Information',
            contact: {
                name: "Code Project"
            },
            servers: ["http://localhost:5000"]
        }
    },
    apis: ["./routes/*.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
        explorer: true
    })
);

const version = process.env.VERSION || 'v1.0.0';

//ROUTES
app.use(`/api/auth`, authRoute);
app.use('/api/admin', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
//app.use('/api/email', require('./routes/sendEmail'));

// Server logs
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });
app.use([
    morgan('combined'),
    morgan('combined', { stream: accessLogStream }),
]);

//sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

//prevent http param pollution
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10mins
    max: 100
})
app.use(limiter);

app.use(errorHandler);
app.use(notFound);

const PORT = parseInt(process.env.PORT) || 5000;
const server = app.listen(PORT, logger.info(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

//handle unhandled promise rejections
process.on('unhandledRejection', (err, Promise) => {
    logger.info(`Error: ${err.message}`.rainbow);

    //close server & exit process
    server.close(() => process.exit(1));
});