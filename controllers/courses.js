const Course = require("../models/Course");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");

// @desc        Get Courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:bootcampId/courses
// @access      Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  console.log(req.params);

  if(req.params.bootcampId){
      query = Course.find({ bootcamp : req.params.bootcampId});
  }else{
      query = Course.find();
  }

  query.populate({path: 'bootcamp', select : 'name description'});

  const courses = await query;


  res.status(200).json({
    success: true,
    length: courses.length,
    data: courses,
  });
});
