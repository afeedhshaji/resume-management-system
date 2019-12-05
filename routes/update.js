const router = require('express').Router();
const Candidate = require('../models/candidate');
const Position = require('../models/position');
const Skills = require('../models/skills');

router.put('/update', function (req, res) {
  Candidate.findById(req.body.candidate_id, async function(err, candidate) {
    if (err){
      res.send(err);
    }

    if (req.body.name==""){
      res.send("Name cannot be blank");
      return;
    }


    //Checking and inserting into positions collection --  only if modified
    let candidate_position_present = candidate.position;
    let candidate_position_new = req.body.position.toLowerCase();
    if (candidate_position_new){
      if (candidate_position_present != candidate_position_new) {
        console.log("inp")
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

    // Checking and inserting into skills collection --only if array has been modified
    let candidate_skills_present = candidate.skills;
    let candidate_skills_new = req.body.skills;

    if (candidate_skills_new){
      candidate_skills_new = candidate_skills_new.map(function(x){ return x.toLowerCase() })
      let skill;
      for (skill of candidate_skills_new) {
        if (!candidate_skills_present.includes(skill)){
          console.log("ins")
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


    //Update candidate info here except date, resume-url
    candidate.name = req.body.name;
    candidate.email = req.body.email;
    candidate.position = candidate_position_new;
    candidate.experience = req.body.experience;
    candidate.qualification = req.body.qualification;
    candidate.candidateRating = req.body.candidateRating;
    candidate.salary = req.body.salary;
    candidate.phone = req.body.phone;
    candidate.companiesWorked = req.body.companiesWorked;
    candidate.skills = candidate_skills_new;
    candidate.interviewFeedback = req.body.interviewFeedback;

    // save the candidate
    candidate.save(function(err){
      if (err)
        res.send(err);
      res.json({ message: 'Candidate updated!' });
    });
  });
});

module.exports = router;
