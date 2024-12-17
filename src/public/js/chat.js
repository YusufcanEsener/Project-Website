// URL'den room parametresini al
const urlParams = new URLSearchParams(window.location.search);
const userRoom = urlParams.get('room') || 'default-room';

// Socket bağlantısı için doğru port (3001)
const socket = io('http://localhost:3001', {
    transports: ['websocket'],
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const sender = document.getElementById('sender');
const message = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');

// Sayfa yüklendiğinde kullanıcı bilgisini al
fetch('/auth/current-user')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Kullanıcı bilgisi alınamadı');
    })
    .then(data => {
        if (!data || !data.email) {
            throw new Error('Kullanıcı email bilgisi bulunamadı');
        }

        sender.value = `${data.ad} ${data.soyad}`;
        
        // Odaya katıl
        socket.emit('join-room', userRoom);
        
        // Kullanıcının mesajlarını yükle
        return fetch(`/api/messages/${userRoom}`);
    })
    .then(response => response.json())
    .then(messages => {
        output.innerHTML = '';
        messages.reverse().forEach(msg => {
            output.insertAdjacentHTML('beforeend', 
                formatMessage(msg.sender, msg.message, msg.createdAt)
            );
        });
        // Scroll'u en alta getir
        output.scrollTop = output.scrollHeight;
    })
    .catch(err => {
        console.error('Hata:', err.message);
    });

// Mesaj gönderme fonksiyonu
function sendMessage() {
    if (!message.value || !userRoom) return;

    const messageData = {
        message: message.value,
        sender: sender.value,
        room: userRoom
    };

    // API'ye mesajı kaydet ve başarılı olursa socket üzerinden gönder
    fetch('/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
    })
    .then(response => response.json())
    .then(savedMessage => {
        // Socket üzerinden mesajı gönder
        socket.emit('chat', savedMessage);
    })
    .catch(err => {
        console.error('Mesaj gönderme hatası:', err);
    });

    message.value = '';
}

// Submit butonu için event listener
submitBtn.addEventListener('click', sendMessage);

// Enter tuşu için event listener
message.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Mesaj formatı fonksiyonu
function formatMessage(sender, message, timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const timeString = `${day}/${month} ${hours}:${minutes}`;
    
    return `
        <p class="${sender === document.getElementById('sender').value ? 'sent' : 'received'}">
            <strong>${sender}</strong>
            ${message}
            <span class="message-time">${timeString}</span>
        </p>
    `;
}

// Socket olaylarını dinle
socket.on('chat', (data) => {
    feedback.innerHTML = '';
    
    // Mesajı ekrana ekle
    const messageHtml = formatMessage(data.sender, data.message, data.createdAt || new Date());
    output.insertAdjacentHTML('beforeend', messageHtml);
    
    // Scroll'u en alta getir
    output.scrollTop = output.scrollHeight;
    
    // Admin kontrolü ve mesaj işaretleme
    fetch('/auth/current-user')
        .then(response => response.json())
        .then(user => {
            if (user.admin) {
                fetch('/api/messages/mark-as-read', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ room: userRoom })
                });
            }
        });
});

socket.on('typing', (data) => {
    feedback.innerHTML = `<p><em>${data} yazıyor...</em></p>`;
});

// Yazıyor bildirimi için
message.addEventListener('keypress', () => {
    if (userRoom) {
        socket.emit('typing', { sender: sender.value, room: userRoom });
    }
});
