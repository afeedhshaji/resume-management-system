const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
      lowercase : true,
      max: 255,
      index: true
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Position', positionSchema);
