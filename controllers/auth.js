const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");



//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.registerUser = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;

    await User.create({
        name,
        email,
        password,
        role
    });

  res.status(200).json({
      success : true
  });
});
