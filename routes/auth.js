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
    .then(async function(){

      //Checking and inserting into position collection
      var position = candidate['position'];
      positionExist = await Postition.findOne({position : position});
      console.log(positionExist)
      if (!positionExist) {
        const pos = new Postition({
          position : position
        });
        pos.save();
      }

      res.json(candidate)
      })
    .catch(err => res.status(400).json(`Error:${err}`));
});

module.exports = router;
