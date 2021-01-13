const mongoose = require('mongoose');
const logger = require('../utils/winston-logger');

const connectDB = async () => {

const mongoUri = process.env.DEV_MONGODB_DATABASE_URL 
   const conn = await mongoose.connect(mongoUri,{
  
       useNewUrlParser: true,
       useCreateIndex: true,
       useCreateIndex: true, 
       useUnifiedTopology: true
   })


   logger.info(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold)

   mongoose.connection.on('error', logger.error.bind(console, 'connection error:'));
}


module.exports = connectDB;
