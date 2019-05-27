var express = require('express');
var async = require('async');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Over EZ' });
});

router.get('/get/:date', function(req, res, next) {
    let dt = new Date(req.params.date); // e.g. req.params.date = "2017-09-05"
    console.log(dt);
    req.db.Digest.find({ date: req.params.date },
      function(err, result) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(result);
        }
      }
    );
});

router.get('/get', function(req, res, next) {
  let newDigest = new req.db.Digest(req.config);
  res.send(newDigest);
});

router.post('/save', function(req, res, next) {
  async.waterfall([
    function(callback) {
      let newDigest = new req.db.Digest(req.body);
      newDigest.save(function(err) {
        if (err) {
          callback([500, "Failed to save new digest: " + err.message]);
        } else {
          callback(null);
        }
      });
    }
  ], function(err) {
    if (err) {
      /* send error message if we have one */
      res.status(err[0]).send(err[1]);
    } else {
      /* otherwise, send success */
      res.sendStatus(200);
    }
  });
});

module.exports = router;
