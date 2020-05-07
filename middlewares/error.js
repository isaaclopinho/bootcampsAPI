const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
    let error = {... err};
    error.message = err.message;

    console.log(err.stack.red);
    
    //console.log(err); to show values
    //Mongoose bad Object ID
    if(err.name === "CastError"){
        error = new ErrorResponse(`Bootcamp not found with id ${err.value}`, 404);
    }

    //Mongoose duplicate key
    if(err.code === 11000){
        error = new ErrorResponse(`Duplicate field value entered`, 400);        
    }

     //Validation Error
     if(err.name === 'ValidationError'){
         const message = Object.values(err.errors).map(x => x.message);
        error = new ErrorResponse(message, 400);        
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error : error.message || 'Server error'
    });
}

module.exports = errorHandler;