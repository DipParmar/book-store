require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const dbURI = process.env.DB;

//db
const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('Connected to database');
  } catch (e) {
    console.log('error occured while connecting to database', e);
  }
};

//routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

//server
app.listen(port, async () => {
  console.log('Server is running');

  // connect to database
  // await isn't required but it's just to indicate that this function is asynchronous
  await connectToDatabase();
});
