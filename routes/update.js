const router = require('express').Router();
const Candidate = require('../models/candidate');
const Position = require('../models/position');
const Skills = require('../models/skills');
const { registerValidation } = require('../validation/validation');


//Update API
router.post('/update', function (req, res) {
  Candidate.findById(req.body.candidate_id, async function(err, candidate) {
    id = req.body.candidate_id;
    let current_record = await Candidate.findById(id);

    if (err){
      return res.render('edit', {
        records: current_record,
        success: '',
        error: err
      });
    }

    // Check validation of email
    const { error } = registerValidation(req.body);
    if (error) {
      return res.render('edit', {
        records: current_record,
        success: '',
        error: error.details[0].message
      });
    }

    if (req.body.name==""){
      //Issue : Error code ??
      return res.render('edit', {
        records: current_record,
        success: '',
        error: 'Name cannot be blank'
      });
    }


    //Checking and inserting into positions collection --  only if old position is modified
    let candidate_position_present = candidate.position;
    let candidate_position_new = req.body.position;
    if (candidate_position_new){
      candidate_position_new = candidate_position_new.toLowerCase();
      if (candidate_position_present != candidate_position_new) {
        const positionExist = await Position.findOne({
          position: candidate_position_new
        });
        if (!positionExist) {
          const pos = new Position({
            position: candidate_position_new
          });
          pos.save();
        }
      }
    }

    // Checking and inserting into skills collection --only if skills array has been modified
    let candidate_skills_present = candidate.skills;
    let candidate_skills_new = req.body.skills;

    if(candidate_skills_new){
      if (typeof candidate_skills_new === 'object') {
        candidate_skills_new = candidate_skills_new.map(item => {
          return item.trim().toLowerCase();
        }).filter(Boolean);
      } else {
        candidate_skills_new = [candidate_skills_new.trim().toLowerCase()];
      }
      let skill;
      for (skill of candidate_skills_new) {
        if (!candidate_skills_present.includes(skill)){
          const skillsExist = await Skills.findOne({ skill: skill });
          if (!skillsExist) {
            const new_skill = new Skills({
              skill: skill
            });
            new_skill.save();
          }
        }
      }
    }
    else{
      //For empty input
      candidate_skills_new = []
    }


    //Processing companiesWorkedArray
    let companiesWorkedArray = req.body.companiesWorked;
    if (companiesWorkedArray){
      if (typeof companiesWorkedArray === 'object') {
        companiesWorkedArray = companiesWorkedArray.map(item => {
          return item.trim();
        }).filter(Boolean);
      } else {
        companiesWorkedArray = [companiesWorkedArray.trim()];
      }
    }
    else{
      //For empty input
      companiesWorkedArray = []
    }

    //Update candidate info here except date, resume-url
    candidate.name = req.body.name;
    candidate.email = req.body.email;
    candidate.position = candidate_position_new;
    candidate.experience = req.body.experience;
    candidate.qualification = req.body.qualification;
    candidate.candidateRating = req.body.candidateRating;
    candidate.salary = req.body.salary;
    candidate.phone = req.body.phone;
    candidate.companiesWorked = companiesWorkedArray;
    candidate.skills = candidate_skills_new;
    candidate.interviewFeedback = req.body.interviewFeedback;
    candidate.status = req.body.status;

    // save the candidate
    candidate.save(function(err) {
      if (err){
        return res.render('edit', {
          records: current_record,
          success: '',
          error: err.message
        });
      }
      res.redirect('/api/candidate/list');
    });
  });
});

module.exports = router;
