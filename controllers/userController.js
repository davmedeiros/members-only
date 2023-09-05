const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.user_create_get = (req, res, next) => {
  res.render('user_sign_up', { title: 'Sign Up' });
};

exports.user_create_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name cannot be empty.'),
  body('surname')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Surname cannot be empty.'),
  body('surname')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Username cannot be empty.'),

  asyncHandler(async (req, req, next) => {
    const errors = validationResult(req);

    const user = new User({
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      res.render('user_signup', {
        title: 'Sign Up',
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      await user.save();
      res.redirect(user.url);
    }
  }),
];