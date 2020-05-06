// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  PUBLIC
exports.getBootcamps = (req, res, next ) => {
    res.status(200).json({
        success: true,
        msg: 'Show all bootcamps'
    });
};


// @desc    Create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  PUBLIC
exports.postBootcamp = (req, res, next ) => {
    res.status(200).json({
        success: true,
        msg: "Create bootcamp"
    });
};


// @desc    Get a bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  PUBLIC
exports.getBootcamp = (req, res, next ) => {
    res.status(200).json({
        success: true,
        msg: `Show bootcamp ${req.params.id}`
    });
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