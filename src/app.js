const express = require('express');
const session = require('express-session');
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

// Mesaj API'sini dahil et
const messageRoutes = require('./api/messages'); // api/messages.js dosyanızı burada dahil edin
app.use('/api/messages', messageRoutes);
// Socket.io yapılandırması
const io = socket(server);

io.on('connection', (socket) => {
    console.log(`${socket.id} bağlandı`);

    // Mesaj gönderildiğinde tüm bağlı kullanıcılara ilet
    socket.on('chat', async (data) => {
        // Veritabanına mesajı kaydet
        try {
            const newMessage = new Message({
                sender: data.sender,
                message: data.message,
            });
            await newMessage.save();  // Veritabanına kaydet

            // Mesajı tüm kullanıcılara ilet
            io.sockets.emit('chat', newMessage);
        } catch (err) {
            console.error('Mesaj kaydedilemedi:', err);
        }
    });

    // Kullanıcı yazarken bildirim göndermek için
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
        const messages = await Message.find().sort({ createdAt: 1});  // Mesajları tarih sırasına göre al
        res.status(200).json(messages);  // Mesajları döndür
    } catch (err) {
        res.status(500).json({ error: 'Mesajlar alınamadı', message: err.message });
    }
});

// Auth routes
app.use('/auth', require('./routes/auth'));

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} portunda çalışıyor`);
});
