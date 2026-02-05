const express = require('express');
const router = express.Router();
const userHandler = require('../controllers/userHandler');

router.post('/addUser', userHandler.addUser);
router.get('/getUser', userHandler.userFetcher );

module.exports = router;