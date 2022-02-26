const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv');
const path = require('path')




// Setting up config file 
dotenv.config({ path: 'config/config.env' })
const errorMiddleware = require('./middlewares/errors')

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload());


const auth = require('./routes/auth');
const donation = require('./routes/donation');
const requestor = require('./routes/requestor');

app.use('/api/v1', auth)
app.use('/api/v1', donation)
app.use('/api/v1', requestor)




// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app