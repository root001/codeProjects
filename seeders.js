const moongose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/userModel');
const users = require('./seeders/users');
const connectDB  = require('./configs/mongodb-config');

dotenv.config();

connectDB();


const importData = async () => {
  try {
   
   await User.deleteMany();

   await User.insertMany(users);

    console.log('Data Imported!'.green.inverse);

    process.exit();
  } catch (error) {

    console.error(`${error}`.red.inverse);

    process.exit(1)
  }
};


const destroyData = async () => {
  try {
 
    await User.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}

