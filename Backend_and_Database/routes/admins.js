const express = require('express');
const router = express.Router();
const { permit, ROLES } = require('../middleware/role');
const verifyJWT = require('../middleware/verifyJWT');

router.use("/auth", require("./admin_routes/adminAuth"));

router.use(verifyJWT);
router.use(permit(ROLES.ADMIN));

router.use("/notes", require("./admin_routes/adminNotes"));

module.exports = router;