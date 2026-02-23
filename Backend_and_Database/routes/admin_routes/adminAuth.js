const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

router.post('/login', authController.adminLogin);
router.post('/signup', authController.adminSignup);

module.exports = router;