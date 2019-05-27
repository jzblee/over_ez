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
});

var personSchema = mongoose.Schema( {
    name: { type: String }
  , nickname: { type: String }
  , email: { type: String }
});

var eventSchema = mongoose.Schema( {
    type: {
        type: String
      , required: true
      , enum: ['special', 'service', 'fellowship']
    }
  , name : { type: String, required: true }
  , link : { type: String }
  , chairs : { type: String }
  , date_start : { type: Date, required: true}
  , date_end : { type: Date }
  , time_start : { type: Date }
  , time_end : { type: Date }
  , description : { type: String }
});

var committeeSchema = mongoose.Schema( {
    name: { type: String }
  , time: { type: Date }
  , location: { type: String }
});

/* digests */
var digestSchema = mongoose.Schema( {
    date : {
        type: Date
      , required: true 
    }
  , cssFile : {
        type: String
      , required: true
    }
  , message : messageSchema
  , events_special : [eventSchema]
  , events_service : [eventSchema]
  , events_fellowship : [eventSchema]
  , maintainer : personSchema
  , svp : personSchema
  , fvp : personSchema
  , committees : [committeeSchema]
  , meetingsUrl : { type: String }
});


/*
The server should be restarted after dropping a collection to regenerate the index.
Alternatively, you can run db.<coll>.remove({}), which will not delete the index.
*/
digestSchema.index({'date': -1}, {unique: true});

module.exports = {
    Message: mongoose.model('Message', messageSchema)
  , Person: mongoose.model('Person', personSchema)
  , Event: mongoose.model('Event', eventSchema)
  , Committee: mongoose.model('Committee', committeeSchema)
  , Digest: mongoose.model('Digest', digestSchema)
};

