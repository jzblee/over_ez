var express = require('express');
var async = require('async');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Over EZ' });
});

router.get('/get/:date', function(req, res, next) {
    req.db.Digest.find({ date: req.params.date },
      function(err, result) {
        if (err) {
          res.status(500).send(err);
        } else {
          // unique index enforces one digest per date, so always send the 0th result
          res.send(result[0]);
        }
      }
    );
});

router.get('/get', function(req, res, next) {
  let newDigest = new req.db.Digest(req.config);
  res.send(newDigest);
});

router.get('/digest/:date', function(req, res, next) {
    req.db.Digest.find({ date: req.params.date },
      function(err, result) {
        if (err) {
          res.status(500).send(err);
        } else {
          // unique index enforces one digest per date, so always send the 0th result
          res.render('digest', { title: 'Digest window', standalone: true, date: req.params.date });
        }
      }
    );
});

router.get('/digest', function(req, res, next) {
  res.render('digest', { title: 'Digest window', standalone: false });
});

router.get('/list', function(req, res, next) {
  req.db.Digest.aggregate() // TODO: add archived flag to filter out old digests
    .project({ date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } })
    .sort({ date: -1 })
    .exec(function(err, result) {
      if (err) {
        res.status(500).send(err);
      } else {
        var output = result.map(function(obj) {
          return obj.date;
        });
        res.send(output);
      }
    });
});

router.post('/save', function(req, res, next) {
  async.waterfall([
    function(callback) {
      /*
      Since the digest data that is being transmitted is a repurposed
      Mongoose schema, the request body will contain _id keys that may
      not change if the user is saving a new digest from a previous copy.
      As a result, just remove the top level _id key for now to ignore
      collisions.

      TODO: scrub all _id information from transmitted request body before
            sending to server
      */
      delete req.body._id;
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
