const router = require('express').Router();
const Candidate = require('../models/candidate');

router.get('/autocomplete/', function(req, res, next) {
  const regex = new RegExp(req.query['term'], 'i');
  console.log('entered');
  const userFilter = Candidate.find({ email: regex }, { email: 1 }).limit(20);
  userFilter.exec(function(err, data) {
    console.log(data);
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
      console.log(result);
      res.jsonp(result);
    }
  });
});

module.exports = router;
