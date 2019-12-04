const router = require('express').Router();
const Candidate = require('../models/candidate');
const Postition = require('../models/position');

router.post('/register', async (req, res) => {
  // Checking if the candidate exits in DB
  const emailExist = await Candidate.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send('Email already exits');
  }

  const candidate = new Candidate({
    date: req.body.date,
    name: req.body.name,
    email: req.body.email,
    position: req.body.position,
    experience: req.body.experience,
    qualification: req.body.qualification,
    candidateRating: req.body.candidateRating,
    salary: req.body.salary,
    phone: req.body.phone,
    companiesWorked: req.body.companiesWorked,
    skills: req.body.skills,
    interviewFeedback: req.body.interviewFeedback,
    resumeURL: req.body.resumeURL
  });

  await candidate
    .save()
    .then(async function() {
      // Checking and inserting into position collection
      const Position = candidate['position'];
      const positionExist = await Postition.findOne({ position: Position });
      if (!positionExist) {
        const pos = new Postition({
          position: Position
        });
        pos.save();
      }
      res.json(candidate);
    })
    .catch(err => res.status(400).json(`Error:${err}`));
});

router.get('/autocomplete/', function(req, res, next) {
  const regex = new RegExp(req.query['term'], 'i');
  console.log('entered');
  const userFilter = Candidate.find({ email: regex }, { email: 1 }).limit(20);
  userFilter.exec(function(err, data) {
    console.log(data);
    const result = [];
    if (!err) {
      if (data && data.length && data.length > 0) {
        data.forEach(user => {
          const obj = {
            id: user._id,
            label: user.email
          };
          result.push(obj);
        });
      }
      console.log(result);
      res.jsonp(result);
    }
  });
});

router.get('/list', function(req, res) {
  const userFilter = Candidate.find({}).limit(20);
  userFilter.exec(function(err, data) {
    console.log(data.length);
    const result = [];
    if (!err) {
      if (data && data.length && data.length > 0) {
        data.forEach(user => {
          const obj = {
            id: user._id,
            label: user.email
          };
          result.push(obj);
        });
      }
      res.json(result);
    }
  });
});

module.exports = router;
