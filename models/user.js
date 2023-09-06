const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  is_member: { type: Boolean, required: true, default: false },
});

UserSchema.virtual('url').get(function () {
  return `/profile/${this.username}`;
});

UserSchema.virtual('full_name').get(function () {
  return `${this.name} ${this.surname}`;
});

module.exports = mongoose.model('User', UserSchema);
