const {
 Schema, model, SchemaTypes, Types, 
} = require('mongoose');

const str = SchemaTypes.String;

const message = {
  messageId: {
    type: str,
    required: true,
  },
  messageContent: {
    type: str,
    default: null,
  },
  createdAt: {
    type: SchemaTypes.Date,
  },
  isReaded: {
    type: SchemaTypes.Boolean,
    default: false,
  },
};

const friend = {
  userId: {
    type: str,
    required: true,
  },
  isFriend: {
    type: SchemaTypes.Boolean,
    default: false,
  },
  messages: [message],
  username: str,
};

const userSchema = {
  userId: str,
  status: {
    type: SchemaTypes.Boolean,
    default: false,
  },
  friends: [friend],
  stageOfAdding: [friend],
};

const User = new Schema(userSchema);

module.exports = model('user', User);
