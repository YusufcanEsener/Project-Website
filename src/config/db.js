const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB bağlantısı başarılı');
    } catch (err) {
        console.error('MongoDB bağlantı hatası:', err);
        process.exit(1);
    }
};

module.exports = connectDB;