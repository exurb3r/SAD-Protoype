const express = require('express');
const router = express.Router();
const taskHandler = require('../../controllers/taskHandler');
const verifyJWT = require('../../middleware/verifyJWT');
const { permit, ROLES } = require('../../middleware/role');

router.use(verifyJWT);
router.get('/get', permit(ROLES.ADMIN, ROLES.USER), taskHandler.taskFetcher);
router.post('/post', permit(ROLES.ADMIN, ROLES.USER), taskHandler.taskAdder);
router.put('/put', permit(ROLES.ADMIN, ROLES.USER), taskHandler.taskEditor);
router.delete('/delete', permit(ROLES.ADMIN, ROLES.USER), taskHandler.taskDeleter);

module.exports = router;