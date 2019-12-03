const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255
    },
    email: {
      type: String,
      max: 255,
      min: 6,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address'
      ]
    },
    position: {
      type: String,
      max: 255,
      min: 6
    },
    experience: {
      type: Number
    },
    qualification: {
      type: String
    },
    candidateRating: {
      type: Number
    },
    salary: {
      type: Number
    },
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v);
        },
        message: 'Provided phone number is not a valid phone number!'
      }
    },
    companiesWorked: {
      type: [String]
    },
    skills: {
      type: [String]
    },
    interviewFeedback: {
      type: [String]
    },
    resumeURL: {
      type: [String],
      required: true
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Candidate', candidateSchema);
