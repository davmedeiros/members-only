const User = require('../models/user');
const Message = require('../models/message');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.message_view_get = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().exec();
  res.render('forum', { title: 'Forum', messages: messages });
});

exports.message_create_post = [
  body('text')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage(`Can't post empty messages.`),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    console.log('user: ' + req.user);

    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      user: req.user,
    });

    if (!errors.isEmpty()) {
      res.render('forum', {
        title: 'Forum',
        errors: errors.array(),
      });
      return;
    } else {
      await message.save();
      res.redirect('forum');
    }
  }),
];
