const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});
const morgan = require('morgan');
const connectDB = require('./config/db');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const colors = require('colors');
const handleErrors = require("./middlewares/error");


//Connect to db
connectDB();

const app = express();

// Json middleware

app.use(express.json());

// Dev logging middleware
if(process.env.NODE_ENV == "development"){
    app.use(morgan('dev'));
}

// Mount routers

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// Handle errors
app.use(handleErrors);


const PORT = process.env.PORT;

const server = app.listen(PORT, console.log(`server running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});