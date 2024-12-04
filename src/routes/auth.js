const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { ad, soyad, email, sifre } = req.body;
        const user = new User({ ad, soyad, email, sifre });
        await user.save();
        res.redirect('/auth/login');
    } catch (err) {
        res.status(400).send('Kayıt işlemi başarısız');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, sifre } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).send('Kullanıcı bulunamadı');
        }

        const isMatch = await bcrypt.compare(sifre, user.sifre);
        if (!isMatch) {
            return res.status(400).send('Geçersiz şifre');
        }

        req.session.userId = user._id;
        res.redirect('/');
    } catch (err) {
        res.status(400).send('Giriş başarısız');
    }
});

// Mevcut auth.js dosyasına ekleyin
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Çıkış yapılırken hata oluştu');
        }
        res.redirect('/');
    });
});
module.exports = router;