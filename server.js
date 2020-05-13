const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});
const morgan = require('morgan');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload');
const bootcamps = require('./routes/bootcamps');
const auth = require('./routes/auth');
const reviews = require('./routes/reviews');
const users = require('./routes/users');
const courses = require('./routes/courses');
const colors = require('colors');
const handleErrors = require("./middlewares/error");
const cookie = require('cookie-parser');
const sanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const expressRateLimit = require('express-rate-limit');
const cors = require('cors');
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

//sanitize data
app.use(sanitize());

//security to headers
app.use(helmet());

//prevents xss attacks
app.use(xss());

// rate limit
const limiter = expressRateLimit({
    windowMs : 10 * 60 * 1000, //10 min
    max: 100
});

app.use(limiter);

// prevent http param polution
app.use(hpp());

// enable cors
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Mount routers

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', users);
app.use('/api/v1/reviews', reviews);

// Handle errors
app.use(handleErrors);


const PORT = process.env.PORT;

const server = app.listen(PORT, console.log(`server running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});