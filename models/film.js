let mongoose = require('mongoose');

//Movie schema
let filmSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  plot: {
    type: String,
    required: true
  }
});

let Film = module.exports = mongoose.model('Film', filmSchema);