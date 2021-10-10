require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

//server
app.listen(port, () => console.log('Server is running'));
