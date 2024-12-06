const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGODB;

const initialiseDatabase = async () => {
  //   try {
  //     const connection = await mongoose.connect(mongoUri);
  //     if (connection) {
  //       console.log('Connected to database');
  //     }
  //   } catch (error) {
  //     console.log('Error connecting to database', error);
  //   }

  await mongoose
    .connect(mongoUri)
    .then(() => console.log('Connected to database'))
    .catch((error) => console.log('Error connecting to databse', error));
};

module.exports = { initialiseDatabase };
