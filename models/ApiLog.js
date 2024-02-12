const mongoose = require('mongoose');

const apiLogSchema = new mongoose.Schema({
  username: { type: String, required: true },
  apiType: String,
  requestDetails: mongoose.Schema.Types.Mixed, 
  responseDetails: mongoose.Schema.Types.Mixed, 
  timestamp: { type: Date, default: Date.now }
});

const ApiLog = mongoose.model('ApiLog', apiLogSchema);

module.exports = ApiLog;
