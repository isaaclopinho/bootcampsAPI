const express = require('express');
const dotenv = require('dotenv');


const bootcamps = require('./routes/bootcamps');

dotenv.config({path: './config/config.env'});

const app = express();

// Mount routers

app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT;

app.listen(PORT, console.log(`server running on ${process.env.NODE_ENV} mode on port ${PORT}`))