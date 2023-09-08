const express = require('express');
const router = express.Router();
const message_controller = require('../controllers/messageController');

router.post('/:id', message_controller.message_delete_post);

module.exports = router;
