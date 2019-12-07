const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema(
  {
    qualification: {
      type: String,
      required: true,
      lowercase: true,
      max: 255,
      index: true
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Qualification', qualificationSchema);
