// models/Message.js
const mongoose = require('mongoose');

// Mesaj şeması
const MessageSchema = new mongoose.Schema({
    sender: { type: String, required: true }, // Gönderenin adı
    message: { type: String, required: true }, // Mesaj içeriği
    createdAt: { type: Date, default: Date.now } // Mesajın gönderildiği tarih
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
