const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    price: { type: String, required: true },
    plan: { type: String, required: true },
    content: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Price', schema);