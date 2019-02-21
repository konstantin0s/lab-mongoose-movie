let mongoose = require('mongoose');

//Movie schema
let movieSchema = mongoose.Schema({
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

let Movie = module.exports = mongoose.model('Movie', movieSchema);