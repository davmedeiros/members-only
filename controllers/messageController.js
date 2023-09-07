const User = require('../models/user');
const Message = require('../models/message');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.message_view_get = (req, res, next) => {
  res.send('Not yet implemented');
};

exports.message_create_post = (req, res, next) => {
  res.send('Not yet implemented');
};
