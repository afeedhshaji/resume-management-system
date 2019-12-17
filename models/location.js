const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      lowercase: true,
      max: 255,
      index: true
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Location', locationSchema);
