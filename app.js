const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const logger= require('./utils/winston-logger');
const fs = require('fs');
const mongoSanitize= require('express-mongo-sanitize');
const setResHeaders = require('./middleware/headers-middleware');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./configs/swagger.json');
const hpp = require('hpp');
const connectDB = require('./configs/mongodb-config');

//load env vars
dotenv.config();

connectDB()

const app = express();

app.use(express.json());

//set response header
app.use(setResHeaders);

//swagger 
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
  })
);


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

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10mins
    max: 100
})

app.use(limiter);

// prevent http param pollution
app.use(hpp());

 
const PORT = parseInt(process.env.PORT) || 5000;


const server = app.listen(PORT, logger.info(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));



//handle unhandled promise rejections
process.on('unhandledRejection', (err, Promise) => {
    console.log(`Error: ${err.message}`.red);

    //close server & exit process
    server.close(() => process.exit(1));
});