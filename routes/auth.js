const router = require('express').Router();
const Candidate = require('../models/candidate');
const Position = require('../models/position');
const Skills = require('../models/skills');

// index page
router.get('/', (req, res) => {
  res.render('insert_users', { success: '', error: '' });
});

router.post('/register', async (req, res) => {
  console.log('entered');
  // Checking if the candidate exits in DB
  const emailExist = await Candidate.findOne({ email: req.body.email });
  if (emailExist) {
    return res.render('insert_users', {
      success: '',
      error: 'Email already exists'
    });
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
      const candidate_position = candidate['position'];
      const positionExist = await Position.findOne({ position: candidate_position });
      if (!positionExist) {
        const pos = new Position({
          position: candidate_position
        });
        pos.save();
      }

      const candidate_skills = candidate['skills'];
      for (skill of candidate_skills){
        
      }

      const skillsExist = await Skills.findOne({ skill: candidate_position });
      if (!positionExist) {
        const pos = new Position({
          position: candidate_position
        });
        pos.save();
      }
      // res.json(candidate);
      // res.render('index');
      return res.render('insert_users', {
        success: 'Record inserted successfully',
        error: ''
      });
    })
    .catch(err => res.status(400).json(`Error:${err}`));
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
