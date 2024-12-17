// models/Message.js
const mongoose = require('mongoose');

// Mesaj şeması
const MessageSchema = new mongoose.Schema({
    sender: String,
    message: String,
    room: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
