const router = require('express').Router();
const Candidate = require('../models/candidate');
const Position = require('../models/position');
const Skills = require('../models/skills');
const { registerValidation } = require('../validation/validation');

// index page
router.get('/', async (req, res) => {
  res.render('insert_users', { success: '', error: '' });
});

// Register API
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

  // Convert skills to lower case
  const skills = req.body.skills.split(',').map(item => {
    return item.trim().toLowerCase();
  });
  console.log(skills);
  req.body.skills = skills;

  const candidate = new Candidate({
    date: req.body.date,
    name: req.body.name,
    email: req.body.email,
    position: req.body.position.toLowerCase(),
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
      candidate_skills.forEach(async skill => {
        const skillsExist = await Skills.findOne({ skill: skill });
        if (!skillsExist) {
          const new_skill = new Skills({
            skill: skill
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

// View candidates
router.get('/list', (req, res) => {
  const userFilter = Candidate.find({});
  userFilter.exec((err, data) => {
    if (err) throw err;
    res.render('list', { records: data });
  });
});

// Delete API
router.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const del = Candidate.findByIdAndDelete(id);
  del.exec(err => {
    if (err) throw err;
    res.redirect('/api/candidate/list');
  });
});

// Edit API
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const edit = Candidate.findById(id);
  edit.exec((err, data) => {
    if (err) throw err;
    res.render('edit', { records: data });
  });
});

// Update API
router.post('/update', async (req, res) => {
  const update = Candidate.findByIdAndUpdate(req.body.id, {
    date: req.body.date,
    name: req.body.name,
    email: req.body.email,
    position: req.body.position.toLowerCase(),
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
  update.exec((err, data) => {
    if (err) throw err;
    res.redirect('/api/candidate/list');
  });
});

router.get('/list/autocomplete/position', function(req, res, next) {
  console.log('entered');
  const regex = new RegExp(req.query['term'], 'i');
  console.log('entered');
  const userFilter = Position.find({ position: regex }, { position: 1 }).limit(
    20
  );
  userFilter.exec(function(err, data) {
    console.log(data);
    const result = [];
    if (!err) {
      if (data && data.length && data.length > 0) {
        data.forEach(user => {
          const obj = {
            id: user._id,
            label: user.position
          };
          result.push(obj);
        });
      }
      console.log(result);
      res.jsonp(result);
    }
  });
});

router.get('/list/autocomplete/skills', function(req, res, next) {
  console.log('entered');
  const regex = new RegExp(req.query['term'], 'i');
  console.log('entered');
  const userFilter = Skills.find({ skill: regex }, { skill: 1 }).limit(20);
  userFilter.exec(function(err, data) {
    console.log(data);
    const result = [];
    if (!err) {
      if (data && data.length && data.length > 0) {
        data.forEach(user => {
          const obj = {
            id: user._id,
            label: user.skill
          };
          result.push(obj);
        });
      }
      console.log(result);
      res.jsonp(result);
    }
  });
});

router.post('/search', function(req, res, next) {
  const fltrPosition = req.body.fltrposition;
  const fltrSkill = req.body.fltrskill;
  let flterParameter;

  if (fltrPosition === '') {
    flterParameter = {
      skill: fltrSkill
    };
  } else if (fltrSkill === '') {
    flterParameter = {
      position: fltrPosition
    };
  } else {
    flterParameter = {
      skill: fltrSkill,
      position: fltrPosition
    };
  }

  const candidateFilter = Candidate.find(flterParameter);
  candidateFilter.exec(function(err, data) {
    if (err) throw err;
    res.render('list', { records: data });
  });
});

module.exports = router;
