const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Belirli bir odanın mesajlarını getir
router.get('/:room', async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.room }).sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Mesajlar alınamadı', message: err.message });
    }
});

// Yeni mesaj kaydet
router.post('/', async (req, res) => {
    try {
        const { message, sender, room } = req.body;
        const newMessage = new Message({ sender, message, room });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Mesaj kaydedilemedi', message: err.message });
    }
});

module.exports = router;
