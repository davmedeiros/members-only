const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

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

exports.user_login_post = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Enter your username.'),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter your password.'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('login', {
        title: 'Login',
        errors: errors.array(),
      });
      return;
    } else {
      passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
      });
    }
  }),
];
