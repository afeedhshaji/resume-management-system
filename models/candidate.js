const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255
    },
    email: {
      type: String,
      required: true,
      max: 255,
      min: 6
      // match: [
      //   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      //   'Please fill a valid email address'
      // ]
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    position: {
      type: String,
      required: true,
      max: 255,
      min: 6
    },
    yearsOfService: {
      type: Number,
      required: true
    },
    qualification: {
      type: String,
      required: true
    },
    candidateRating: {
      type: Number,
      required: true
    },
    salary: {
      type: Number,
      required: true
    },
    phone: {
      type: String,
      required: true
      // validate: {
      //   validator: function(v) {
      //     return /^\d{10}$/.test(v);
      //   },
      //   message: 'Provided phone number is not a valid phone number!'
      // }
    },
    companiesWorked: {
      type: [String],
      required: true
    },
    skills: {
      type: [String]
    },
    interviewFeedback: {
      type: [String]
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model('User', userSchema);
