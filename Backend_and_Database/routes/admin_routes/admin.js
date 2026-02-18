const express = require('express');
const router = express.Router();
const taskHandler = require('../../controllers/taskHandler');
const verifyJWT = require('../../middleware/verifyJWT');
const { permit, ROLES } = require('../../middleware/role');

router.use(verifyJWT);
router.get('/get', permit(ROLES.ADMIN), taskHandler.taskFetcher);
router.post('/post', permit(ROLES.ADMIN), taskHandler.taskAdder);
router.put('/put', permit(ROLES.ADMIN), taskHandler.taskEditor);
router.delete('/delete', permit(ROLES.ADMIN), taskHandler.taskDeleter);

module.exports = router;