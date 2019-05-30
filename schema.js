var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/over_ez', { useCreateIndex: true, useNewUrlParser: true });

/* bomb out on error */
mongoose.connection.on('error', function(err) {
    console.error("Failed to connect to MongoDB: %s", err);
    process.exit(1);
});

var messageSchema = mongoose.Schema( {
    enable: { type: Boolean, default: false }
  , body: { type: String }
  , signoff1: { type: String }
  , signoff2: { type: String }
}, { _id: false });

var personSchema = mongoose.Schema( {
    name: { type: String }
  , nickname: { type: String }
  , email: { type: String }
}, { _id: false });

var eventSchema = mongoose.Schema( {
    name : { type: String }
  , link : { type: String }
  , chairs : { type: String }
  , date_start : { type: Date }
  , date_end : { type: Date }
  , time_start : { type: Date }
  , time_end : { type: Date }
  , description : { type: String }
}, { _id: false });

var eventGroupSchema = mongoose.Schema( {
    special : [eventSchema]
  , service : [eventSchema]
  , fellowship : [eventSchema]
}, { _id: false });

var committeeSchema = mongoose.Schema( {
    name: { type: String }
  , time: { type: String }
  , location: { type: String }
}, { _id: false });

/* digests */
var digestSchema = mongoose.Schema( {
    date : { type: Date, required: true }
  , cssFile : { type: String }
  , message : messageSchema
  , events : eventGroupSchema
  , maintainer : personSchema
  , svp : personSchema
  , fvp : personSchema
  , committees : [committeeSchema]
  , meetingsUrl : { type: String }
});

var userSchema = mongoose.Schema( {
    username: { type: String }
  , password: { type: String }
});


/*
The server should be restarted after dropping the collection to regenerate the index.
Alternatively, you can run db.<coll>.deleteMany({}), which will not delete the index.
*/
digestSchema.index({'date': -1}, {unique: true});

module.exports = {
    Message: mongoose.model('Message', messageSchema)
  , Person: mongoose.model('Person', personSchema)
  , Event: mongoose.model('Event', eventSchema)
  , EventGroup: mongoose.model('EventGroup', eventGroupSchema)
  , Committee: mongoose.model('Committee', committeeSchema)
  , Digest: mongoose.model('Digest', digestSchema)
  , User: mongoose.model('User', userSchema)
};

