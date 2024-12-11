const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Mesajları almak için GET isteği
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 }); // En son mesajlar önce gelir
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Mesajlar alınamadı', message: err.message });
    }
});

// Mesaj göndermek için POST isteği
router.post('/', async (req, res) => {
    try {
        const { message, sender } = req.body;
        const newMessage = new Message({ sender, message });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Mesaj kaydedilemedi', message: err.message });
    }
});

module.exports = router;
