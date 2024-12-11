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
        sender.value = data.ad + " " + data.soyad; // Kullanıcı adı veya email
        sender.disabled = true;
    })
    .catch(err => {
        console.error('Hata:', err.message);
    });
    window.onload = () => {
        fetch('/api/messages')  // Mesajları API'den al
            .then(response => response.json())
            .then(data => {
                // Veritabanından alınan mesajları ekranda göster
                data.forEach(msg => {
                    // Mesajı en üste ekle
                    output.insertAdjacentHTML('afterbegin', `<p><strong>${msg.sender} :</strong> ${msg.message}</p>`);
                });
                
            })
            .catch(err => {
                console.error('Mesajlar alınamadı:', err.message);
            });
    };

submitBtn.addEventListener('click', () => {
    const messageData = {
        message: message.value,
        sender: sender.value
    };

    // Mesajı sunucuya gönder
    socket.emit('chat', messageData);

    // Mesajı veritabanına kaydet
    fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Mesaj veritabanına kaydedildi:', data);
        
    })
    .catch(err => {
        console.error('Mesaj kaydedilemedi:', err);
    });

    message.value = '';  // Mesajı temizle
});

socket.on('chat', data => {
    feedback.innerHTML = '';
    output.innerHTML += `<p><strong>${data.sender} : </strong>${data.message}</p>`;
});

message.addEventListener('keypress', () => {
    socket.emit('typing', sender.value);
});

socket.on('typing', data => {
    feedback.innerHTML = `<p>${data} yazıyor...</p>`;
});
