const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  facebookId: String,

  roles: {
    type: [
      {
        type: String,
        enum: ['user', 'employer']
      }
    ],
    default: ['user']
  },
  employees: {
    type: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'users'
        }
      }
    ]
  }
});

module.exports = mongoose.model('users', User);
