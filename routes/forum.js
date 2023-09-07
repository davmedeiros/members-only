const express = require('express');
const router = express.Router();
const message_controller = require('../controllers/messageController');

router.get('/', message_controller.message_view_get);
router.post('/', message_controller.message_create_post);

module.exports = router;
