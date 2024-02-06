const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  username: String,
  citySearched: String,
  searchTime: Date,
  weatherData: Object 
});

const Search = mongoose.model('Search', logSchema);

module.exports = Search;
