const router = require('express').Router();
const Candidate = require('../models/candidate');
const Postition = require('../models/position');
const { registerValidation } = require('../validation/validation');

// index page
router.get('/', (req, res) => {
  res.render('insert_users', { success: '', error: '' });
});

router.post('/register', async (req, res) => {
  console.log('entered');
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
      error: 'error.details[0].message'
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
      const Position = candidate['position'];
      const positionExist = await Postition.findOne({ position: Position });
      if (!positionExist) {
        const pos = new Postition({
          position: Position
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
