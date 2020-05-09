const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");

// @desc        Get Courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:bootcampId/courses
// @access      Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  console.log(req.params);

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({ path: "bootcamp", select: "name description" });
  }


  const courses = await query;

  res.status(200).json({
    success: true,
    length: courses.length,
    data: courses,
  });
});

// @desc    Get a course
// @route   GET /api/v1/courses/:id
// @access  PUBLIC
exports.getCourse = asyncHandler(async (req, res, next) => {
  const courses = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!courses)
    throw new ErrorResponse(`Course not found with id ${req.params.id}`, 404);

  res.status(200).json({
    success: true,
    data: courses,
  });
});

// @desc    Create a bootcamp
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  PUBLIC
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    throw new ErrorResponse(
      `Bootcamp not found with id ${req.params.bootcampId}`,
      404
    );
  }

  const course = await Course.create(req.body);

  //201 pra criação de conteudo
  res.status(201).json({
    success: true,
    data: course,
  });
});
