let mongoose = require('mongoose');

//Movie schema
let celebritySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  occupation: {
    type: String,
    required: true
  },
  catchPhrase: {
    type: String,
    required: true
  }
});

let Celebrity = module.exports = mongoose.model('Celebrity', celebritySchema);