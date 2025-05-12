const mongoose = require('mongoose');

const numberSchema = new mongoose.Schema({
  value: { type: Number, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Number', numberSchema);
