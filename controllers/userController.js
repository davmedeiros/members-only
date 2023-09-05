const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, resultValidator } = require('express-validator');

exports.user_create_get = (req, res, next) => {
  res.render('user_sign_up', { title: 'Sign Up' });
};
