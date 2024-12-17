const express = require('express');
const session = require('express-session');
const favicon = require('serve-favicon');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');
const Message = require('./models/Message'); // Mesaj modelini dahil et
const socket = require('socket.io');

const app = express();
const server = app.listen(3001, () => {
    console.log('Sunucu http://localhost:3001 portunda çalışıyor');
});

// MongoDB bağlantısı
connectDB();

// Middleware'leri ekle
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'public', 'logo.ico')));

// Mesaj API'sini dahil et
const messageRoutes = require('./api/messages'); // api/messages.js dosyanızı burada dahil edin
app.use('/api/messages', messageRoutes);
// Socket.io yapılandırması
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log(`${socket.id} bağlandı`);

    socket.on('join-room', (room) => {
        if (room) {
            socket.join(room);
            console.log(`${socket.id} ${room} odasına katıldı`);
        }
    });

    socket.on('chat', async (data) => {
        try {
            if (!data.room) {
                console.error('Room değeri eksik:', data);
                return;
            }
            
            // Mesajı odadaki tüm kullanıcılara gönder
            io.in(data.room).emit('chat', {
                sender: data.sender,
                message: data.message,
                room: data.room,
                createdAt: data.createdAt || new Date()
            });
            
        } catch (err) {
            console.error('Mesaj gönderilemedi:', err);
        }
    });

    socket.on('typing', (data) => {
        if (data.room) {
            socket.to(data.room).emit('typing', data.sender);
        }
    });
});

// Middleware
app.use(express.static(path.join(__dirname, '../')));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
    secret: 'gizli-anahtar',
    resave: false,
    saveUninitialized: false
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ana sayfa route'u
app.get('/', async (req, res) => {
    const user = req.session.userId ? await User.findById(req.session.userId) : null;
    res.render('index', { user });
});

// Diğer sayfa route'ları
app.get('/iletisim', async (req, res) => {
    const user = req.session.userId ? await User.findById(req.session.userId) : null;
    res.render('iletisim', { user });
});
app.get('/mesaj', async (req, res) => {
    const user = req.session.userId ? await User.findById(req.session.userId) : null;
    res.render('mesaj', { user });
});
app.get('/merak-edilenler', async (req, res) => {
    const user = req.session.userId ? await User.findById(req.session.userId) : null;
    res.render('merak-edilenler', { user });
});
app.get('/programlar', async (req, res) => {
    const user = req.session.userId ? await User.findById(req.session.userId) : null;
    res.render('programlar', { user });
});
app.get('/odeme', async (req, res) => {
    const user = req.session.userId ? await User.findById(req.session.userId) : null;
    res.render('odeme', { user });
});
app.get('/odeme2', async (req, res) => {
    const user = req.session.userId ? await User.findById(req.session.userId) : null;
    res.render('odeme2', { user });
});
app.get('/odeme3', async (req, res) => {
    const user = req.session.userId ? await User.findById(req.session.userId) : null;
    res.render('odeme3', { user });
});
app.get('/odeme4', async (req, res) => {
    const user = req.session.userId ? await User.findById(req.session.userId) : null;
    res.render('odeme4', { user });
});

// Profil sayfası middleware
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

// Profil sayfası route'u
app.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/auth/login');
        }
        res.render('profile', { user });
    } catch (err) {
        res.redirect('/auth/login');
    }
});

// Mesaj API'si (POST request ile mesaj kaydetme)
app.post('/api/messages', async (req, res) => {
    try {
        const { message, sender } = req.body;

        // Yeni mesaj oluştur
        const newMessage = new Message({ sender, message });
        await newMessage.save();  // Veritabanına kaydet

        // Başarıyla kaydedilen mesajı döndür
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Mesaj kaydedilemedi', message: err.message });
    }
});
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: 1 });  // Mesajları tarih sırasına göre al
        res.status(200).json(messages);  // Mesajları döndür
    } catch (err) {
        res.status(500).json({ error: 'Mesajlar alınamadı', message: err.message });
    }
});

// Auth routes
app.use('/auth', require('./routes/auth'));

// Admin kontrolü için middleware
const requireAdmin = async (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }
    try {
        const user = await User.findById(req.session.userId);
        if (!user || !user.admin) {
            return res.redirect('/profile');
        }
        next();
    } catch (err) {
        res.redirect('/profile');
    }
};

// Admin profil sayfası route'u
app.get('/adminprofil', requireAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/auth/login');
        }
        
        // Tüm kullanıcıları getir
        const users = await User.find({ admin: { $ne: true } });
        
        // Her kullanıcı için okunmamış mesaj sayısını hesapla
        const usersWithUnreadCount = await Promise.all(users.map(async (member) => {
            const unreadCount = await Message.countDocuments({
                room: member.email,
                isRead: false,
                sender: member.ad + ' ' + member.soyad // Sadece kullanıcıdan gelen mesajları say
            });
            return {
                ...member.toObject(),
                unreadCount
            };
        }));

        res.render('adminprofil', { user, users: usersWithUnreadCount });
    } catch (err) {
        res.redirect('/auth/login');
    }
});

// Profil yönlendirme middleware'i
const profileRedirect = async (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/auth/login');
        }
        if (user.admin === true) {
            return res.redirect('/adminprofil');
        }
        return res.redirect('/profile');
    } catch (err) {
        return res.redirect('/auth/login');
    }
};

// Profil yönlendirme route'u
app.get('/redirect-profile', profileRedirect);

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} portunda çalışıyor`);
});
