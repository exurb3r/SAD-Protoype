const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

//User 
router.post('/login', authController.userLogin);
router.post('/signup', authController.userSignup);

//Admin
router.post('/admin_login', authController.adminLogin);
router.post('/admin_signup', authController.adminSignup);

module.exports = router;
