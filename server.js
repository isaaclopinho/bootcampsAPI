const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});
const morgan = require('morgan');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload');
const bootcamps = require('./routes/bootcamps');
const auth = require('./routes/auth');
const users = require('./routes/users');
const courses = require('./routes/courses');
const colors = require('colors');
const handleErrors = require("./middlewares/error");
const cookie = require('cookie-parser');


//Connect to db
connectDB();

const app = express();

// Json middleware
app.use(express.json());


app.use(cookie());

// Dev logging middleware
if(process.env.NODE_ENV == "development"){
    app.use(morgan('dev'));
}

app.use(fileupload());

app.use(express.static(path.join(__dirname, 'public')));

// Mount routers

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', users);

// Handle errors
app.use(handleErrors);


const PORT = process.env.PORT;

const server = app.listen(PORT, console.log(`server running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});