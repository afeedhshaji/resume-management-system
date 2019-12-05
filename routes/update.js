const router = require('express').Router();
const Candidate = require('../models/candidate');
const Position = require('../models/position');
const Skills = require('../models/skills');

router.put('/update', function (req, res) {
  Candidate.findById(req.body.candidate_id, function(err, candidate) {
    if (err){
      res.send(err);
    }

    //Update candidate info here
    candidate.name = req.body.name;

    // save the candidate
    candidate.save(function(err){
      if (err)
        res.send(err);
      res.json({ message: 'Candidate updated!' });
    });
  });
});

module.exports = router;
