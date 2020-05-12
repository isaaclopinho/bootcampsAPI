const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const sendMail = require('../utils/sendEmail');
const crypto = require('crypto');


//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.registerUser = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;

  const user =  await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);
});



//@desc     Login User
//@route    POST /api/v1/auth/login
//@access   Public
exports.loginUser = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;


    //Validade email and password
    if(!email || !password){
        return next( new ErrorResponse("Please provide an email and password", 400));
    }

    // pq o password nao aparecer por default
    const user = await User.findOne({
        email
    }).select("+password");

    if(!user){
        return next(new ErrorResponse("Invalid credentials", 401));
    }


    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendTokenResponse(user, 200, res);
});



//@desc     Get logged in user by token
//@route    GET /api/v1/auth/me
//@access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    console.log(user);

    res.status(200).json({
      success: true,
      data: user
    });
});


//@desc     Forgot Password
//@route    POST /api/v1/auth/forgotpassword
//@access   Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email : req.body.email});

    if(!user){
        return next(new ErrorResponse('There is no user with that email.', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`


try {
    await sendMail({
        email: user.email,
        subject: 'Password reset token',
        message
    });
    res.status(200).json({
        success: true,
        data: 'Email sent'
    });
} catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;    
    await user.save({ validateBeforeSave: false});
    return next(new ErrorResponse('Email could not be sent', 500));
}
});


//@desc     Reset password
//@route    PUT /api/v1/auth/resetpassword/:resettoken
//@access   Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

    //Get Hashed password
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({resetPasswordToken, resetPasswordExpire : { $gt : Date.now()}});
    
    if(!user){
        return next(new ErrorResponse('Invalid Token', 400));
    }

    user.password = req.body.password;

    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
});



// Get token from model, create cookie send response

const sendTokenResponse = (user, statusCode, res) => {

    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE *24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        sucess : true,
        token: token
    });

};