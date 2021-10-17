require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const expressValidator = require('express-validator');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;
const dbURI = process.env.DB;

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes configuration
routes.forEach(({ prefix = '', route }) => {
  app.use(prefix, route);
});

//db
const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('Connected to database');
  } catch (e) {
    console.log('Error occured while connecting to database', e);
  }
};

//server
app.listen(port, async () => {
  console.log('Server is running');

  // connect to database
  // await isn't required but it's just to indicate that this function is asynchronous
  await connectToDatabase();
});
