const User = require('../models/user');
const Message = require('../models/message');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const message = require('../models/message');

exports.message_view_get = (req, res, next) => {
  res.send('Not yet implemented');
};

exports.message_create_post = [
  body('text')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage(`Can't post empty messages.`),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      user: req.body.currentUser,
    });

    if (!errors.isEmpty()) {
      res.render('forum', {
        title: 'Forum',
        errors: errors.array(),
      });
      return;
    } else {
      await message.save();
      res.render('forum', { title: 'Forum' });
    }
  }),
];
