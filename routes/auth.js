const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword
} = require("../controllers/auth");

const {protect} = require('../middlewares/authorization');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);

module.exports = router;