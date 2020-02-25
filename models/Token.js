const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Token = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 43200
  }
});
module.exports = mongoose.model("token", Token);
