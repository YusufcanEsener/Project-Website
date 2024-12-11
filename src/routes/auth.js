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
        const { ad, soyad, email, sifre, tekrarsifre } = req.body;

        // Şifrelerin eşleştiğini kontrol et
        if (sifre !== tekrarsifre) {
            return res.status(400).send('Şifreler eşleşmiyor');
        }

    

        // Yeni kullanıcı oluştur
        const user = new User({ ad, soyad, email, sifre });
        await user.save();

        res.redirect('/auth/login');
    }  catch (err) {
        console.error('Kayıt işlemi başarısız:', err.message);
        res.status(400).send(`Kayıt işlemi başarısız: ${err.message}`);
    }
});
router.post('/update-membership4', async (req, res) => {
    try {
        const userId = req.session.userId; // Oturumdaki kullanıcı ID'si

        if (!userId) {
            return res.status(401).send('Kullanıcı giriş yapmamış');
        }

        // Kullanıcıyı bul ve üyelik değerini artır
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Kullanıcı bulunamadı');
        }

        user.uyelik =  4; // Mevcut değer yoksa 0'dan başla
        const currentTime = Date.now(); // Şu anki tarihi alıyoruz
        user.uyelikAt = currentTime; // Şu anki tarihi kullanıcıya atıyoruz

        // 6 hafta sonrası tarihi hesapla
        const weeksToAdd = 52;
        const millisecondsInAWeek = 7 * 24 * 60 * 60 * 1000; // Bir hafta, milisaniye cinsinden
        user.uyelikBitis = new Date(currentTime + weeksToAdd * millisecondsInAWeek); // 6 hafta sonrası

        await user.save();

        res.json({ success: true, message: 'Üyelik başarıyla güncellendi.' });
    } catch (err) {
        console.error('Üyelik güncelleme hatası:', err.message);
        res.status(500).send('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
});
router.post('/update-membership2', async (req, res) => {
    try {
        const userId = req.session.userId; // Oturumdaki kullanıcı ID'si

        if (!userId) {
            return res.status(401).send('Kullanıcı giriş yapmamış');
        }

        // Kullanıcıyı bul ve üyelik değerini artır
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Kullanıcı bulunamadı');
        }

        user.uyelik =  2; // Mevcut değer yoksa 0'dan başla
        const currentTime = Date.now(); // Şu anki tarihi alıyoruz
        user.uyelikAt = currentTime; // Şu anki tarihi kullanıcıya atıyoruz

        // 6 hafta sonrası tarihi hesapla
        const weeksToAdd = 13;
        const millisecondsInAWeek = 7 * 24 * 60 * 60 * 1000; // Bir hafta, milisaniye cinsinden
        user.uyelikBitis = new Date(currentTime + weeksToAdd * millisecondsInAWeek); // 6 hafta sonrası

        await user.save();

        res.json({ success: true, message: 'Üyelik başarıyla güncellendi.' });
    } catch (err) {
        console.error('Üyelik güncelleme hatası:', err.message);
        res.status(500).send('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
});
router.post('/update-membership3', async (req, res) => {
    try {
        const userId = req.session.userId; // Oturumdaki kullanıcı ID'si

        if (!userId) {
            return res.status(401).send('Kullanıcı giriş yapmamış');
        }

        // Kullanıcıyı bul ve üyelik değerini artır
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Kullanıcı bulunamadı');
        }

        user.uyelik = 3; // Mevcut değer yoksa 0'dan başla
        const currentTime = Date.now(); // Şu anki tarihi alıyoruz
        user.uyelikAt = currentTime; // Şu anki tarihi kullanıcıya atıyoruz

        // 6 hafta sonrası tarihi hesapla
        const weeksToAdd = 26;
        const millisecondsInAWeek = 7 * 24 * 60 * 60 * 1000; // Bir hafta, milisaniye cinsinden
        user.uyelikBitis = new Date(currentTime + weeksToAdd * millisecondsInAWeek); // 6 hafta sonrası

        await user.save();

        res.json({ success: true, message: 'Üyelik başarıyla güncellendi.' });
    } catch (err) {
        console.error('Üyelik güncelleme hatası:', err.message);
        res.status(500).send('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
});

router.post('/update-membership', async (req, res) => {
    try {
        const userId = req.session.userId; // Oturumdaki kullanıcı ID'si

        if (!userId) {
            return res.status(401).send('Kullanıcı giriş yapmamış');
        }

        // Kullanıcıyı bul ve üyelik değerini artır
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Kullanıcı bulunamadı');
        }

        user.uyelik = 1; // Mevcut değer yoksa 0'dan başla
        const currentTime = Date.now(); // Şu anki tarihi alıyoruz
        user.uyelikAt = currentTime; // Şu anki tarihi kullanıcıya atıyoruz

        // 6 hafta sonrası tarihi hesapla
        const weeksToAdd = 6;
        const millisecondsInAWeek = 7 * 24 * 60 * 60 * 1000; // Bir hafta, milisaniye cinsinden
        user.uyelikBitis = new Date(currentTime + weeksToAdd * millisecondsInAWeek); // 6 hafta sonrası

        await user.save();

        res.json({ success: true, message: 'Üyelik başarıyla güncellendi.' });
    } catch (err) {
        console.error('Üyelik güncelleme hatası:', err.message);
        res.status(500).send('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, sifre } = req.body;

        // Kullanıcıyı email ile bul
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).send('Kullanıcı bulunamadı');
        }

        // Girilen şifreyi kontrol et
        if (user.sifre !== sifre) {
            return res.status(400).send('Şifre yanlış');
        }

        // Oturum oluştur ve ana sayfaya yönlendir
        req.session.userId = user._id;
        res.redirect('/');
    } catch (err) {
        console.error('Giriş işlemi hatası:', err.message);
        res.status(400).send('Giriş başarısız');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Çıkış yapılırken hata oluştu');
        }
        res.redirect('/');
    });
});

module.exports = router;