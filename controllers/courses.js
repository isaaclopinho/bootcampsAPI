const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");

// @desc        Get Courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:bootcampId/courses
// @access      Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      length: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
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

// @desc    Adds a course to a bootcamp and creates it
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  PRIVATE
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

// @desc    Updates a course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const courses = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!courses)
    throw new ErrorResponse(`Course not found with id ${req.params.id}`, 404);

  //201 pra criação de conteudo
  res.status(201).json({
    success: true,
    data: courses,
  });
});

// @desc    Delete a course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const courses = await Course.findById(req.params.id);

  if (!courses)
    throw new ErrorResponse(`Course not found with id ${req.params.id}`, 404);

  courses.remove();
  //201 pra criação de conteudo
  res.status(201).json({
    success: true,
    data: {},
  });
});
