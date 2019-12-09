const router = require('express').Router();
const Candidate = require('../models/candidate');
const Position = require('../models/position');
const Skills = require('../models/skills');
const Qualification = require('../models/qualification');
const { registerValidation } = require('../validation/validation');

// index page
router.get('/', async (req, res) => {
  res.render('insert_users', { success: '', error: '' });
});

// Register API
router.post('/register', async (req, res) => {
  // Check validation of phone, email
  // const { error } = registerValidation(req.body);
  // if (error) {
  //   return res.render('insert_users', {
  //     success: '',
  //     error: error.details[0].message
  //   });
  // }
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
  const userFilter = Candidate.find({}).limit(20);
  userFilter.exec((err, data) => {
    if (err) throw err;
    res.render('list', { records: data, formData: {}, error: '' });
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

  console.log(req.data)

  const formData = {
    filtername : req.body.filtername,
    filterposition : req.body.filterposition,
    filterskill : req.body['filterskill[]'],
    filterqualification : req.body.filterqualification,
    filterExpMin : req.body.filterExpMin,
    filterExpMax : req.body.filterExpMax,
    filterSalMin : req.body.filterSalMin,
    filterSalMax : req.body.filterSalMax,
    selectStatus : req.body.selectStatus
  }

  console.log(req.body);
  console.log(req.params)
  const filterPosition = req.body.filterposition;
  const filterName = new RegExp(req.body.filtername, 'i');
  const filterQualification = new RegExp(req.body.filterqualification, 'i');

  // Taking skill as array
  let filterSkill = req.body['filterskill[]'];
  console.log(typeof filterSkill)

  if (req.body['filterskill[]'] !== null && req.body['filterskill[]'] !== '' && req.body['filterskill[]'] !== undefined){
    if (typeof filterSkill === 'object') {
      filterSkill = filterSkill
        .map(item => {
          return item.trim().toLowerCase();
        })
        .filter(Boolean);
    } else {
      filterSkill = [filterSkill.trim().toLowerCase()];
    }
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

  const filterParameter = {};

  if (filterPosition !== '' && filterPosition !== null && filterPosition !== undefined) filterParameter.position = filterPosition;
  if (req.body['filterskill[]'] !== null && req.body['filterskill[]'] !== '' && req.body['filterskill[]'] !== undefined && Object.entries(filterSkill).length !== 0)
    filterParameter.skills = { $all: filterSkill };
  if (Object.entries(filterExp).length !== 0)
    filterParameter.experience = filterExp;
  if (Object.entries(filterSal).length !== 0)
    filterParameter.salary = filterSal;
  if (req.body.filtername !== '') filterParameter.name = filterName;
  if (req.body.filterqualification !== '')
    filterParameter.qualification = filterQualification;

  console.log(filterParameter);

  //Calculating page
  const perPage = Number(req.body.length);
  var page = Number(req.body.start)/perPage ;
  if (page==0)
    page = 1;

  const draw = req.body.draw
  // var c;
  // Candidate.countDocuments({}).exec((err, count) => {
  //     if (err) {
  //         res.send(err);
  //         return;
  //     }
  //     c = count;
  // });

  // console.log(c)

  const candidateFilter = Candidate.find(filterParameter).skip(perPage * page - perPage).limit(perPage);
  candidateFilter.exec(function(err, data) {
    if (err) throw err;
    if (data.length > 0) {
      // data["edit"] =
      res.jsonp({ data : data, formData: formData, error: '', recordsTotal: 31000, recordsFiltered: 50, draw: draw});
      console.log('Printing all list');
    } else {
      console.log('Data is empty');
      const newCandidateFilter = Candidate.find().skip(perPage * page - perPage).limit(perPage);
      newCandidateFilter.exec(function(error, result) {
        if (error) throw error;
        res.jsonp({ data: result, formData: formData, error: 'No records were found', recordsTotal: 31000, recordsFiltered: 50, draw: draw});
      });
    }
  });
});

module.exports = router;
