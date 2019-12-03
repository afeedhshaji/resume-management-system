const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
      max: 255
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Position', positionSchema);
