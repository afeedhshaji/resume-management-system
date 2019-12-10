const router = require('express').Router();
const Candidate = require('../models/candidate');
const Position = require('../models/position');
const Skills = require('../models/skills');
const Qualification = require('../models/qualification');
const { registerValidation } = require('../validation/validation');

let filterParameter = {};
let sortParameter = {};
let ascFlag = 0;
let descFlag = 0;

router.get('/sort/:x', function(req, res, next) {
  const { x } = req.params;
  if (sortParameter[x] === 1) {
    descFlag = 1;
    ascFlag = 0;
    // console.log('previously set as 1');
  } else if (sortParameter[x] === undefined || sortParameter[x] === -1) {
    ascFlag = 1;
    descFlag = 0;
    // console.log('previously not set as 1');
  }
  sortParameter = {};
  // console.log(x);
  if (ascFlag === 1) {
    sortParameter[x] = 1;
    // console.log('ascending');
  } else if (descFlag === 1) {
    sortParameter[x] = -1;
    // console.log('descending');
  }
  console.log(sortParameter);
  const perPage = 3;
  const page = req.params.page || 1;
  Candidate.find(filterParameter)
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort(sortParameter)
    .exec(function(err, data) {
      if (err) throw err;
      Candidate.estimatedDocumentCount({}).exec((err, count) => {
        res.render('list', {
          records: data,
          error: '',
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    });
});

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
  if (skillsArray) {
    if (typeof skillsArray === 'object') {
      skillsArray = skillsArray
        .map(item => {
          return item.trim().toLowerCase();
        })
        .filter(Boolean);
    } else {
      skillsArray = [skillsArray.trim().toLowerCase()];
    }
  } else {
    // For empty input
    skillsArray = [];
  }

  // For companies worked
  if (companiesWorkedArray) {
    if (typeof req.body.companiesWorked === 'object') {
      companiesWorkedArray = req.body.companiesWorked
        .map(item => {
          return item.trim();
        })
        .filter(Boolean);
    } else {
      companiesWorkedArray = [req.body.companiesWorked.trim()];
    }
  } else {
    // For empty input
    companiesWorkedArray = [];
  }

  // For position
  let { position } = req.body;
  if (position) position = position.toLowerCase();

  // For Qualification
  let { qualification } = req.body;
  if (qualification) qualification = qualification.toLowerCase();

  const candidate = new Candidate({
    name: req.body.name,
    email: req.body.email,
    position: position,
    experience: req.body.experience,
    qualification: qualification,
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
      const candidatePosition = candidate['position'];
      if (candidatePosition) {
        const positionExist = await Position.findOne({
          position: candidatePosition
        });
        if (!positionExist) {
          const pos = new Position({
            position: candidatePosition
          });
          pos.save();
        }
      }

      // Checking and inserting into skills collection
      const candidateSkills = candidate['skills'];
      if (candidateSkills) {
        candidateSkills.forEach(async skill => {
          const skillsExist = await Skills.findOne({ skill: skill });
          if (!skillsExist) {
            const new_skill = new Skills({
              skill: skill
            });
            new_skill.save();
          }
        });
      }

      // Checking and inserting into qualification collection
      const candidate_qualification = candidate['qualification'];
      if (candidate_qualification) {
        const qualificationExist = await Qualification.findOne({
          qualification: candidate_qualification
        });
        if (!qualificationExist) {
          const new_qualification = new Qualification({
            qualification: candidate_qualification
          });
          new_qualification.save();
        }
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
  filterParameter = {};
  sortParameter = {};
  const perPage = 3;
  const page = req.params.page || 1;

  Candidate.find(filterParameter)
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort(sortParameter)
    .exec(function(err, data) {
      if (err) throw err;
      Candidate.estimatedDocumentCount({}).exec((err, count) => {
        res.render('list', {
          records: data,
          error: '',
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    });
});

router.get('/list/:page', function(req, res, next) {
  console.log(filterParameter);

  const perPage = 3;
  const page = req.params.page || 1;

  Candidate.find(filterParameter)
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort(sortParameter)
    .exec(function(err, data) {
      if (err) throw err;
      Candidate.countDocuments(filterParameter).exec((err, count) => {
        // console.log(Math.ceil(count / perPage));
        res.render('list', {
          records: data,
          error: '',
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
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
  filterParameter = {};
  sortParameter = {};
  const filterPosition = req.body.filterposition;
  const filterName = new RegExp(req.body.filtername, 'i');
  const filterQualification = new RegExp(req.body.filterqualification, 'i');

  // Taking skill as array
  let filterSkill = req.body.filterskill;
  console.log(typeof filterSkill);
  if (typeof filterSkill === 'object') {
    filterSkill = filterSkill
      .map(item => {
        return item.trim().toLowerCase();
      })
      .filter(Boolean);
  } else {
    filterSkill = [filterSkill.trim().toLowerCase()];
  }

  // Taking min and max exerience
  const filterExp = {};
  if (
    req.body.filterExpMin !== null &&
    req.body.filterExpMin !== '' &&
    req.body.filterExpMin !== undefined
  )
    filterExp.$gte = req.body.filterExpMin;
  if (
    req.body.filterExpMax !== null &&
    req.body.filterExpMax !== '' &&
    req.body.filterExpMax !== undefined
  )
    filterExp.$lte = req.body.filterExpMax;

  // Taking min and max salay
  const filterSal = {};
  if (
    req.body.filterSalMin !== null &&
    req.body.filterSalMin !== '' &&
    req.body.filterSalMin !== undefined
  )
    filterSal.$gte = req.body.filterSalMin;
  if (
    req.body.filterSalMax !== null &&
    req.body.filterSalMax !== '' &&
    req.body.filterSalMax !== undefined
  )
    filterSal.$lte = req.body.filterSalMax;

  if (req.body.filterposition !== '') filterParameter.position = filterPosition;
  if (req.body.filterskill !== '' && Object.entries(filterSkill).length !== 0)
    filterParameter.skills = { $all: filterSkill };
  if (Object.entries(filterExp).length !== 0)
    filterParameter.experience = filterExp;
  if (Object.entries(filterSal).length !== 0)
    filterParameter.salary = filterSal;
  if (req.body.filtername !== '') filterParameter.name = filterName;
  if (req.body.filterqualification !== '')
    filterParameter.qualification = filterQualification;
  console.log(req.body);
  if (req.body.selectStatus == 1 || req.body.selectStatus == 0)
    filterParameter.status = req.body.selectStatus;

  console.log(filterParameter);
  const perPage = 3;
  const page = req.params.page || 1;
  const candidateFilter = Candidate.find(filterParameter)
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort(sortParameter)
    .exec(function(err, data) {
      if (err) throw err;
      if (data.length!=0){
        Candidate.estimatedDocumentCount({}).exec((err, count) => {
          res.render('list', {
            records: data,
            error: '',
            current: page,
            pages: Math.ceil(count / perPage)
          });
        });
      }
      else {
        console.log('Data is empty');
        res.render('list', {
          records: [],
          error: '',
          current: 0,
          pages: 0
        });
      }
  });
});

module.exports = router;
