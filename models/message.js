const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  timestamp: { type: Date, required: true, default: new Date() },
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

MessageSchema.virtual('url').get(function () {
  return `/message/${this._id}`;
});

module.exports = mongoose.model('Message', MessageSchema);
