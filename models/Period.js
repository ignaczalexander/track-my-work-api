const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Period = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  shifts: [
    {
      start_date: {
        type: Date,
        required: true
      },
      end_date: {
        type: Date,
        required: true
      },
      hours: {
        type: Number
      }
    }
  ]
});

module.exports = mongoose.model("Period", Period);
