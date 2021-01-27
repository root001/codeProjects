const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
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

const cors = require('cors');
//Scoket io Chat
const chatServer = require('http').createServer(express);
const client = require("socket.io")(chatServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT"],
        credentials: true
    }
});

const Chat = require('./models/chatModel');

//Route files
const authRoute = require('./routes/authRoute');
const version = process.env.VERSION || 'v1.0.0';

const app = express();

//load env vars
dotenv.config();

//disbale cors across all requests
app.use(cors())

connectDB()

app.use(express.json());

//set response header
app.use(setResHeaders);

//swagger 
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

//ROUTES
app.use('/api/admin', require('./routes/userRoutes'));
app.use('/api/chat', require('./routes/chatRoute'));
app.use('/api/auth', authRoute);

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



//Socket io chat bot.
//connect to socket.io
client.on('connection', function(socket) {

    //create function to send status
    sendStatus = function(s) {
        socket.emit('status', s);
    }

    //select top 100 chats
    // const userChat = Chat.find().sort('_id').limit(20);
    Chat.find({}, function(err, chats) {
        console.log(chats);
        if (err) {
            throw err;
        }
        //Emit the messages
        socket.emit('output', chats);
    });

    /**  
     if (userChat) {
         try {
             const stringChat = JSON.stringify(userChat);
             socket.emit('output', stringChat);
         } catch (err) {
             return (err.toString() === 'TypeError: Converting circular structure to JSON');
         }
     } else {
         socket.emit('output', 'No chat for user');
     }
     
         Chat.find.limit(100).sort({ _id: 1 }).toArray(function(err, res) {
             if (err) {
                 throw err;
             }
             //Emit the messages
             socket.emit('output', res);
         });
     */
    //Handle input events
    socket.on('input', function(data) {
        let name = data.name;
        let message = data.message;

        if (name == '' || message == '') {
            //send error status
            sendStatus('Please enter a message');
        } else {
            Chat.create({ name: name, message: message }, function() {
                client.emit('output', [data]);
                //send status object
                sendStatus({
                    message: 'Message sent',
                    clear: true
                });
            });
        }
    });

});
chatServer.listen(4000);