const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  PUBLIC
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
  let queryCopy = { ...req.query };

  let removedParams = ["select", "sort", "page", "limit"];

  removedParams.forEach(x => delete queryCopy[x]);

  let queryStr = JSON.stringify(queryCopy);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr));

  if(req.query.select){
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
  }

  if(req.query.sort){
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
      console.log(sortBy);
  }else{
      query = query.sort('-createdAt');
  }


  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = (page * limit);
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  
  const bootcamps = await query;
  
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }


  res.status(200).json({
    success: true,
    pagination,
    length: bootcamps.length,
    data: bootcamps,
  });
});

// @desc    Create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  PUBLIC
exports.postBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  //201 pra criação de conteudo
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    Get a bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  PUBLIC
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    throw new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404);

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  PUBLIC
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp)
    throw new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404);

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    Delete a bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  PUBLIC
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp)
    throw new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get bootcamps in radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  PUBLIC
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const log = loc[0].longitude;

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[log, lat], radius],
      },
    },
  });

  res.status(200).json({
    success: true,
    data: bootcamps,
  });
});
