const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGODB;

const initialiseDatabase = async () => {
  try {
    const connection = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connection) {
      console.log('Connected to database');
    }
  } catch (error) {
    console.log('Error connecting to database', error);
  }
};

module.exports = { initialiseDatabase };
