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

// Mesajları okundu olarak işaretle
router.post('/mark-as-read', async (req, res) => {
    try {
        const { room } = req.body;
        
        if (!room) {
            return res.status(400).json({ error: 'Room parametresi gerekli' });
        }

        const result = await Message.updateMany(
            { 
                room: room,
                isRead: false,
                sender: { $ne: 'Admin' } // Admin'in gönderdiği mesajları hariç tut
            },
            { 
                $set: { isRead: true } 
            }
        );

        console.log('Mesajlar okundu olarak işaretlendi:', result);

        res.json({ 
            success: true, 
            modifiedCount: result.modifiedCount 
        });
    } catch (err) {
        console.error('Mesaj güncelleme hatası:', err);
        res.status(500).json({ error: 'Mesajlar güncellenemedi' });
    }
});

module.exports = router;
