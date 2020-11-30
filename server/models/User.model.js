const { Schema, model } = require('mongoose');

const userSchema = {
  userId: {
    type: String,
    required: true,
  },
};

const User = new Schema(userSchema);

module.exports = model('user', User);
