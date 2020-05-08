const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');
// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  PUBLIC
exports.getBootcamps = asyncHandler( async (req, res, next) => {
      const bootcamps = await Bootcamp.find();

      res.status(200).json({
        success: true,
        length: bootcamps.length,
        data: bootcamps,
      });
});


// @desc    Create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  PUBLIC
exports.postBootcamp = asyncHandler(async (req, res, next ) => {
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

        if(!bootcamp)
            throw new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404);

        res.status(200).json({
            success: true,
            data : bootcamp
        });
});

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  PUBLIC
exports.updateBootcamp = asyncHandler( async (req, res, next ) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators : true,
        });

        if(!bootcamp)
            throw new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404);

        res.status(200).json({
            success: true,
            data: bootcamp
        });
});

// @desc    Delete a bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  PUBLIC
exports.deleteBootcamp = asyncHandler(async (req, res, next ) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if(!bootcamp)
            throw new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404);

        res.status(200).json({
            success: true,
            data: {}
        });
});



// @desc    Get bootcamps in radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  PUBLIC
exports.getBootcampsInRadius = asyncHandler(async (req, res, next ) => {
    const {zipcode, distance} = req.params;

    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const log = loc[0].longitude;

    const radius = distance/ 3963;

    const bootcamps = await Bootcamp.find({
        location : { 
            $geoWithin: { 
                $centerSphere: [[log,lat], radius]
            }
        }
    });

    res.status(200).json({
        success: true,
        data: bootcamps
    });
});