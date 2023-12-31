const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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
          res.redirect('/login?message=Your account was created, login now.');
        }
      } else {
        return next(err);
      }
    });
  }),
];

exports.user_login_get = (req, res, next) => {
  console.log(req.query.message);
  res.render('login', { title: 'Login', message: req.query.message });
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

exports.user_become_member_get = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id }).exec();

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    return next(err);
  }

  res.render('become_member', { title: 'Become Member' });
});

exports.user_become_member_post = [
  body('code').trim().escape(),
  body('admin').trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      is_member: req.body.code === process.env.SECRET_CODE,
      is_admin: req.body.admin === process.env.ADMIN_CODE,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render('become_member', {
        title: 'Become Member',
        errors: errors.array(),
      });
      return;
    } else {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, user, {});
      res.redirect(updatedUser.url);
    }
  }),
];
