const router = require('express').Router();
const Position = require('../models/position');
const Skills = require('../models/skills');

//Autocomplete position API
router.get('/list/autocomplete/position', function(req, res, next) {
  console.log('entered');
  const regex = new RegExp(req.query['term'], 'i');
  console.log('entered');
  const userFilter = Position.find({ position: regex }, { position: 1 }).limit(20);
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

//Autocomplete skills API
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

module.exports = router;
