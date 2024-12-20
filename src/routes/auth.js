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
    } catch (err) {
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

        user.uyelik = 4; // Mevcut değer yoksa 0'dan başla
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

        user.uyelik = 2; // Mevcut değer yoksa 0'dan başla
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
// Kullanıcının oturum bilgisini istemciye sağlayan endpoint
router.get('/current-user', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Kullanıcı giriş yapmamış' });
    }

    User.findById(req.session.userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
            }
            res.json({ 
                ad: user.ad, 
                soyad: user.soyad,
                email: user.email  // Email bilgisini de gönderiyoruz
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Bir hata oluştu' });
        });
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


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Email veya şifre hatalı');
        }


        
        // Geçici çözüm: Düz metin karşılaştırması
        const isMatch = (sifre === user.sifre) || await bcrypt.compare(sifre, user.sifre);


        if (!isMatch) {
            return res.status(400).send('Email veya şifre hatalı');
        }

        req.session.userId = user._id;


        if (user.admin === true) {
            return res.redirect('/adminprofil');
        } else {
            return res.redirect('/profile');
        }

    } catch (err) {
        console.error('Login hatası:', err);
        res.status(500).send('Sunucu hatası: ' + err.message);
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

// Profil yönlendirme fonksiyonu
const redirectToCorrectProfile = (user, res) => {
    if (user.admin === true) {
        res.redirect('/adminprofil');
    } else {
        res.redirect('/profile');
    }
};

// Ödeme işlemlerinden sonra bu fonksiyonu kullan
router.post('/update-membership', async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        // ... ödeme işlemleri ...
        redirectToCorrectProfile(user, res);
    } catch (err) {
        // ... hata yönetimi ...
    }
});

module.exports = router;