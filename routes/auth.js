const router = require('express').Router();
const Candidate = require('../models/candidate');
const Position = require('../models/position');
const Skills = require('../models/skills');
const { registerValidation } = require('../validation/validation');

// index page
router.get('/', async (req, res) => {
  res.render('insert_users', { success: '', error: '' });
});

router.post('/register', async (req, res) => {
  console.log('entered');

  // Check validation of phone, email
  const { error } = registerValidation(req.body);
  if (error) {
    if (error.details[0].message.includes('phone')) {
      return res.render('insert_users', {
        success: '',
        error: 'Phone number is invalid'
      });
    }
    return res.render('insert_users', {
      success: '',
      error: error.details[0].message
    });
  }
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
      const candidate_position = candidate['position'].toLowerCase();
      const positionExist = await Position.findOne({
        position: candidate_position
      });
      if (!positionExist) {
        const pos = new Position({
          position: candidate_position
        });
        pos.save();
      }

      // Checking and inserting into skills collection
      const candidate_skills = candidate['skills'];
      const skills = candidate_skills[0].split(',').map(function(item) {
        return item.trim();
      });
      skills.forEach(async skill => {
        const skill_to_insert = skill.toLowerCase();
        console.log(skill_to_insert);
        const skillsExist = await Skills.findOne({ skill: skill_to_insert });
        if (!skillsExist) {
          const new_skill = new Skills({
            skill: skill_to_insert
          });
          new_skill.save();
        }
      });

      return res.render('insert_users', {
        success: 'Record inserted successfully',
        error: ''
      });
    })
    .catch(err => res.status(400).json(`Error:${err}`));
});

router.get('/list', (req, res) => {
  const userFilter = Candidate.find({});
  userFilter.exec((err, data) => {
    if (err) throw err;
    res.render('list', { records: data });
  });
});

module.exports = router;
