const express = require('express');
const router = express.Router();
const taskHandler = require('../../controllers/taskHandler');
const verifyJWT = require('../../middleware/verifyJWT');
const { permit, ROLES } = require('../../middleware/role');

router.get('/get', verifyJWT, permit(ROLES.USER), taskHandler.taskFetcher);
router.post('/post', verifyJWT, permit(ROLES.USER), taskHandler.taskAdder);
router.put('/put', verifyJWT, permit(ROLES.USER), taskHandler.taskEditor);
router.delete('/delete', verifyJWT, permit(ROLES.USER), taskHandler.taskDeleter);

module.exports = router;