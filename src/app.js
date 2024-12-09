const express = require('express');
const session = require('express-session');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();

// MongoDB bağlantısı
//connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));
app.use(express.static(path.join(__dirname, 'public')));
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

// İletişim sayfası route'u
app.get('/iletisim', async (req, res) => {
    const user = req.session.userId ? await User.findById(req.session.userId) : null;
    res.render('iletisim', { user });
});

// Profil sayfası middleware
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};
app.get('/programlar', async (req, res) => {
    const user = req.session.userId ? await User.findById(req.session.userId) : null;
    res.render('programlar', { user });
});
app.get('/merak-edilenler', async (req, res) => {
    const user = req.session.userId ? await User.findById(req.session.userId) : null;
    res.render('merak-edilenler', { user });
});
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

// Auth routes
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} portunda çalışıyor`);
});