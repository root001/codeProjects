const mongoose = require('mongoose');
const logger = require('../utils/winston-logger');

const connectDB = async () => {

    const mongoUri = 'mongodb+srv://idris:shittu@cluster0.brad6.mongodb.net/ecert?retryWrites=true&w=majority' 
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
