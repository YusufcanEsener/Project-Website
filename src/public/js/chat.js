// URL'den room parametresini al
const urlParams = new URLSearchParams(window.location.search);
const userRoom = urlParams.get('room') || 'default-room';

const socket = io.connect('http://localhost:3001');
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
        console.log('Room:', userRoom); // Debug için

        // Odaya katıl
        socket.emit('join-room', userRoom);
        
        // Kullanıcının mesajlarını yükle
        return fetch(`/api/messages/${userRoom}`);
    })
    .then(response => response.json())
    .then(messages => {
        output.innerHTML = '';
        messages.forEach(msg => {
            output.insertAdjacentHTML('afterbegin', `<p><strong>${msg.sender} :</strong> ${msg.message}</p>`);
        });
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

    // Socket üzerinden mesajı gönder
    socket.emit('chat', messageData);

    // API'ye mesajı kaydet
    fetch('/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
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

// Socket olaylarını dinle
socket.on('chat', (data) => {
    feedback.innerHTML = '';
    output.insertAdjacentHTML('afterbegin', `<p><strong>${data.sender} :</strong> ${data.message}</p>`);
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
