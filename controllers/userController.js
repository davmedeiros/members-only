const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.user_sign_up_get = (req, res, next) => {
  res.render('sign_up', { title: 'Sign Up' });
};

exports.user_signup_post = [
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

  asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (!err) {
        const errors = validationResult(req);

        const user = new User({
          name: req.body.name,
          surname: req.body.surname,
          username: req.body.username,
          password: hashedPassword,
        });

        if (!errors.isEmpty()) {
          res.render('sign_up', {
            title: 'Sign Up',
            user: user,
            errors: errors.array(),
          });
          return;
        } else {
          await user.save();
          res.redirect(user.url);
        }
      } else {
        return next(err);
      }
    });
  }),
];

exports.user_login_get = (req, res, next) => {
  res.render('login', { title: 'Login' });
};

exports.user_profile_get = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username }).exec();

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    return next(err);
  }

  res.render('profile', { title: 'Profile', user: user });
});
