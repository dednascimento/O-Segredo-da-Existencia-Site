const mongoose = require('mongoose');

const PowerSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model('Power', PowerSchema);
