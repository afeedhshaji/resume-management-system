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
  // Check validation of phone, email
  const { error } = registerValidation(req.body);
  if (error) {
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

  /* One thing to note here is the request we get from input html form maybe array/string (for skills and companies worked).
  If multiple inputs of the same name send request it will be an array, if only one input
  with the name send request, it will be a string. Hence the if-else conditions below for
  "multiple-input-cased" inputs */

  let companiesWorkedArray = req.body.companiesWorked;
  let skillsArray = req.body.skills;

  // For skills
  if (skillsArray){
    if (typeof skillsArray === 'object') {
      skillsArray = skillsArray.map(item => {
        return item.trim().toLowerCase();
      }).filter(Boolean);
    } else {
      skillsArray = [skillsArray.trim().toLowerCase()];
    }
  }
  else{
    //For empty input
    skillsArray = []
  }

  // For companies worked
  if (companiesWorkedArray){
    if (typeof req.body.companiesWorked === 'object') {
      companiesWorkedArray = req.body.companiesWorked.map(item => {
        return item.trim();
      }).filter(Boolean);
    } else {
      companiesWorkedArray = [req.body.companiesWorked.trim()];
    }
  }
  else{
    //For empty input
    companiesWorkedArray = []
  }

  //For position
  let position = req.body.position;
  if(position)
    position = position.toLowerCase();

  const candidate = new Candidate({
    name: req.body.name,
    email: req.body.email,
    position: position,
    experience: req.body.experience,
    qualification: req.body.qualification,
    candidateRating: req.body.candidateRating,
    salary: req.body.salary,
    phone: req.body.phone,
    companiesWorked: companiesWorkedArray,
    skills: skillsArray,
    interviewFeedback: req.body.interviewFeedback,
    resumeURL: req.body.resumeURL
  });

  await candidate
    .save()
    .then(async function() {
      // Checking and inserting into position collection
      const candidate_position = candidate['position'];
      if (candidate_position){
        const positionExist = await Position.findOne({
          position: candidate_position
        });
        if (!positionExist) {
          const pos = new Position({
            position: candidate_position
          });
          pos.save();
        }
      }

      // Checking and inserting into skills collection
      const candidate_skills = candidate['skills'];
      if (candidate_skills){
        candidate_skills.forEach(async skill => {
          const skillsExist = await Skills.findOne({ skill: skill });
          if (!skillsExist) {
            const new_skill = new Skills({
              skill: skill
            });
            new_skill.save();
          }
        });
      }

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
    res.render('list', { records: data, error: '' });
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
    res.render('edit', { records: data, success: '', error: '' });
  });
});

// Search-Filter API
router.post('/search', function(req, res, next) {
  let filterPosition = req.body.filterposition;

  // Taking skill as array
  let filterSkill = req.body.filterskill;
  if (typeof filterSkill === 'object') {
    filterSkill = filterSkill.map(item => {
      return item.trim().toLowerCase();
    }).filter(Boolean);
  } else {
    filterSkill = [filterSkill.trim().toLowerCase()];
  }

  //Taking min and max exerience
  let filterExp = {}
  if(req.body.filterExpMin != null && req.body.filterExpMin!='' && req.body.filterExpMin != undefined)
      filterExp.$gte = req.body.filterExpMin;
  if(req.body.filterExpMax != null && req.body.filterExpMax!=''&& req.body.filterExpMax != undefined)
      filterExp.$lte = req.body.filterExpMax;

  //Taking min and max salay
  let filterSal = {}
  if(req.body.filterSalMin != null && req.body.filterSalMin!='' && req.body.filterSalMin != undefined)
      filterSal.$gte = req.body.filterSalMin;
  if(req.body.filterSalMax != null && req.body.filterSalMax!=''&& req.body.filterSalMax != undefined)
      filterSal.$lte = req.body.filterSalMax;


  const filterParameter = {};

  if (filterPosition !== '') filterParameter.position = filterPosition;
  if (req.body.filterskill !== '') filterParameter.skills = { $all: filterSkill };
  if (Object.entries(filterExp).length !== 0) filterParameter.experience =  filterExp;
  if (Object.entries(filterSal).length !== 0) filterParameter.salary =  filterSal;

  console.log(filterParameter);
  const candidateFilter = Candidate.find(filterParameter);
  candidateFilter.exec(function(err, data) {
    if (err) throw err;
    if (data.length > 0) {
      res.render('list', { records: data, error: '' });
      console.log('Printing all list');
    } else {
      console.log('Data is empty');
      const newCandidateFilter = Candidate.find();
      newCandidateFilter.exec(function(error, result) {
        if (error) throw error;
        res.render('list', { records: result, error: 'No records were found' });
      });
    }
  });
});

module.exports = router;
