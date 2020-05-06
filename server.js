const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const bootcamps = require('./routes/bootcamps');

dotenv.config({path: './config/config.env'});

//Connect to db
connectDB();

const app = express();

// Dev logging middleware
if(process.env.NODE_ENV == "development"){
    app.use(morgan('dev'));
}

// Mount routers

app.use('/api/v1/bootcamps', bootcamps);


const PORT = process.env.PORT;

const server = app.listen(PORT, console.log(`server running on ${process.env.NODE_ENV} mode on port ${PORT}`));


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});