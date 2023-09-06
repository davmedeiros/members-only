const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');

router.get('/:id', user_controller.user_become_member_get);
router.post('/:id', user_controller.user_become_member_post);

module.exports = router;
