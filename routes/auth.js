const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword, 
    updateDetails,
    updatePassword,
    logout
} = require("../controllers/auth");

const {protect} = require('../middlewares/authorization');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/me').get(protect, getMe);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/updatedetails').put(protect, updateDetails);

router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);

module.exports = router;