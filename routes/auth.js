const router = require('express').Router();
const User = require('../models/candidate');

router.post('/register', async (req, res) => {
  // Checking if the user exits in DB
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send('Email already exits');
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    date: req.body.date,
    position: req.body.position,
    yearsOfService: req.body.yearsOfService,
    qualification: req.body.qualification,
    candidateRating: req.body.candidateRating,
    salary: req.body.salary,
    phone: req.body.phone,
    companiesWorked: req.body.companiesWorked,
    skills: req.body.skills,
    interviewFeedback: req.body.interviewFeedback,
    resumeURL: req.body.resumeURL
  });

  await user
    .save()
    .then(() => res.json(user))
    .catch(err => res.status(400).json(`Error:${err}`));
});

module.exports = router;
