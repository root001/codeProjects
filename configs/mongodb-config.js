const mongoose = require('mongoose');
const logger = require('../utils/winston-logger');

const connectDB = async () => {

    //const mongoUri = 'mongodb+srv://idris:shittu@cluster0.brad6.mongodb.net/ecert?retryWrites=true&w=majority' 
    const mongoUri = 'mongodb+srv://dbadmin:pa55w0rd1@ecommerce.al6d0.mongodb.net/ecommerceDb?authSource=admin&replicaSet=atlas-140e4q-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true'
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
