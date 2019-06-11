const express = require('express');
const async = require('async');
const router = express.Router();
const request = require('request');
const fs = require('fs');
const path = require('path');

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;
const passport = require('passport');

const config = require('../config');
const db = require('../schema');
const render = require('../render');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const nodemailer = require("nodemailer");

/*
 * Send an email message with the given date and HTML content.
 * 
 * date: formatted date string (yyyy-MM-dd)
 * html: full message HTML
 */
function send(date, html, next){

  let transporter = nodemailer.createTransport({
    host: render.smtpServer,
    auth: {
      user: render.smtpUser,
      pass: render.smtpPassword
    }
  });

  let mailOptions = {
    from: render.emailFrom,
    to: render.emailTo,
    subject: "EZ Digest - " + date,
    html: html
  }

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      next(error);
    } else {
      console.log('Email sent: ' + info.response);
      next(null);
    }
  });
}

router.get('/signin', ensureLoggedOut('/'), function(req,res) {
    res.render('signin', { error: req.flash('error')[0] });
});
router.post('/signin',
passport.authenticate('local', { successRedirect: '/',
                                 failureRedirect: '/signin',
                                 failureFlash: "invalid details, try again" })
);
router.get('/signout', function(req,res) {
  req.logout();
  res.redirect('/');
});

router.get('/get/:date', ensureLoggedIn('/'), function(req, res, next) {
    db.Digest.findOne({ date: req.params.date },
      function(err, result) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(result);
        }
      }
    );
});

router.get('/get', ensureLoggedIn('/'), function(req, res, next) {
  let newDigest = new db.Digest(config);
  res.send(newDigest);
});

router.get('/digest/:date', ensureLoggedIn('/'), function(req, res, next) {
  db.Digest.findOne({ date: req.params.date },
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

router.get('/digest', ensureLoggedIn('/'), function(req, res, next) {
  res.render('digest', { title: 'Digest window', standalone: false });
});

router.get('/publishEmail', ensureLoggedIn('/'), function(req, res, next) {
  res.json({emailTo: render.emailTo});
});

router.post('/render/:date', ensureLoggedIn('/'), function(req, res, next) {
  let base_url_ = 'http://' + req.headers.host;
  // Use a custom request jar here to store the session cookie.
  // This way, it can be passed to jsdom to make sure all further
  // requests remain authenticated.
  var j = request.jar();
  request.post({url: base_url_ + '/signin/', form:{username:render.username, password: render.password}, jar: j}, function(postErr, postRes, postResBody) {
    if (postErr) {
      return console.error('local login failed:', postErr);
    }
    let url_ = base_url_ + '/digest/' + req.params.date;
    request({url: url_, jar: j}, function (error, response, body) {
      var failure = false;
      // Convert request library jar to jsdom CookieJar
      const cookieJar = new jsdom.CookieJar(j._jar.store);
      const render = new JSDOM('<script type="text/javascript">app = null;</script>' + body, { cookieJar, url: url_, runScripts: "dangerously", resources: "usable" });
      var timeout = setTimeout(function() {
        failure = true;
        res.status(504).send('Render request timed out');
      }, 10000);
      if (!failure) {
        render.window.document.addEventListener('DigestLoaded', function() {
          // TODO: customizable stylesheet
          // Add the digest CSS file to the rendered HTML, inline
          var mainCss = fs.readFileSync(path.normalize(__dirname + "/../public/stylesheets/digest.css"), 'utf8');
          var head = render.window.document.createElement('newHead');
              style = render.window.document.createElement("style");
              style.type = 'text/css';
              style.innerHTML = mainCss;
              head.appendChild(style);
          clearTimeout(timeout);
          setTimeout(function() {
            // setTimeout gives a bit of time for the DOM to update
            var html = '<head>' + head.innerHTML + '</head><body><div id="digest">' + render.window.document.getElementById('digest').innerHTML + '</div></body>';
            send(req.params.date, html, function(err) {
              if (err) {
                res.status(500).send(err);
              } else {
                res.status(200).send('OK');
              }
            });
          }, 100);
        });
      }
    });
  });
});

router.get('/list', ensureLoggedIn('/'), function(req, res, next) {
  db.Digest.aggregate() // TODO: add archived flag to filter out old digests
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

router.post('/save', ensureLoggedIn('/'), function(req, res, next) {
  async.waterfall([
    function(callback) {
      db.Digest.deleteOne({ date: req.body.date },
        function(err, result) {
          if (err) {
            callback([500, "Failed to overwrite existing digest: " + err.message]);
          } else {
            callback(null);
          }
        }
      );
    },
    function(callback) {
      /*
      Since the digest data that is being transmitted is a repurposed
      Mongoose schema, the request body will contain an _id key that may
      not change if the user is saving a new digest from a previous copy.
      So, just remove the _id key to avoid those kinds of collisions.

      NOTE: An _id field is required for the top level document (in this
            case, the Digest document) to be saved to the database, but
            we can just 1) declare an _id field in the top level schema
            and 2) delete the existing_id value when submitting and a
            new one will be generated for our object.

      See /schema.js
      Reference: https://mongoosejs.com/docs/guide.html#_id
      */
      delete req.body._id;
      let newDigest = new db.Digest(req.body);
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

router.get('/*', ensureLoggedIn('/signin'), function(req, res) {
  res.render('index');
});

module.exports = router;
