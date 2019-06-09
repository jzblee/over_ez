exports.checkAuth = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.send('You are not authorized to view this page, please <a href="/signin">sign in</a>.');
  } else {
    next();
  }
}
exports.createHash = function(bcrypt, username, password, db, done){
  bcrypt.hash(password, bcrypt.genSaltSync(10), function(err, hash) {
    if (err) return done(err);
    db.User.findOneAndUpdate({ username: username }, {$set: { password: hash }}, function (err) {
      if (err) return done(err);
    });
    return done(null, hash);
  });
}
exports.authHash = function(bcrypt, username, password, db, done) {
  var hash;
  db.User.findOne({ username: username }, function (err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    hash = user.password;
    bcrypt.compare(password, hash, function(err, match) {
      if (err) return done(err);
      done(null, user, match);
    });
  });
}
