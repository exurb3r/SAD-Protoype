const express = require('express');
const router = express.Router();

router.use("/auth", require("./system_routes/systemAuth"));

module.exports = router;