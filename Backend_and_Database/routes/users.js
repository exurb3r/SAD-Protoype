const express = require('express');
const router = express.Router();
const { permit, ROLES } = require('../middleware/role');
const verifyJWT = require('../middleware/verifyJWT');

router.use("/auth", require("./user_routes/userAuth"));

router.use(verifyJWT);
router.use(permit(ROLES.USER));

router.use("/notes", require("./user_routes/userNotes"));

module.exports = router;