const Bootcamp = require("../models/Bootcamp");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  PUBLIC
exports.getBootcamps = async (req, res, next) => {
  try {
      const bootcamps = await Bootcamp.find();

      res.status(200).json({
        success: true,
        length: bootcamps.length,
        data: bootcamps,
      });

  } catch (error) {
    res.status(400).json({
        success : false
    });  
  }
  
};


// @desc    Create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  PUBLIC
exports.postBootcamp = async (req, res, next ) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        //201 pra criação de conteudo
        res.status(201).json({
          success: true,
          data: bootcamp,
        });
    } catch (error) {
        res.status(400).json({
            success : false
        });   
    }
    
};


// @desc    Get a bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  PUBLIC
exports.getBootcamp = async (req, res, next ) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            throw {message:"id doesnt exists"};
        }

        res.status(200).json({
            success: true,
            data : bootcamp
        });

    } catch (error) {
        res.status(400).json({
            success : false,
            error : error.message
        });
    }
    
};

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  PUBLIC
exports.updateBootcamp = (req, res, next ) => {
    res.status(200).json({
        success: true,
        msg: `Update bootcamp ${req.params.id}`
    });
};

// @desc    Delete a bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  PUBLIC
exports.deleteBootcamp = (req, res, next ) => {
    res.status(200).json({
        success: true,
        msg: `Delete bootcamp ${req.params.id}`
    });
};