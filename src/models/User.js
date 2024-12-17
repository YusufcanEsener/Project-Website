const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    ad: { type: String, required: true },
    soyad: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    sifre: { type: String, required: true },
    uyelik: {type: Number,required:false ,default:0},
    uyelikAt: {type: Date,required:false, },
    uyelikBitis: {type: Date,required:false, },
    admin: {type: Boolean,required:false, default:false},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);