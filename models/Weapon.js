const mongoose = require('mongoose');

const WeaponSchema = new mongoose.Schema({
  name: { type: String, required: true },
  allowedPowers: { type: [String], default: [] } // Lista de poderes que podem usar a arma
});

module.exports = mongoose.model('Weapon', WeaponSchema);
