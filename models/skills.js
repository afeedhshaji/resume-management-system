const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
      lowercase: true,
      max: 255,
      index: true
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Skills', skillsSchema);
