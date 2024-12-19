const mongoose = require('mongoose');

const UniverseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true } // Nome do universo (único e obrigatório)
});

module.exports = mongoose.model('Universe', UniverseSchema);
