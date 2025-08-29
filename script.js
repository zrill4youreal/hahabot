const socket = io('http://localhost:5000'); // Ganti dengan URL server Anda
const messagesList = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const fileInput = document.getElementById('file-input');

socket.on('message', (message) => {
    displayMessage(message);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value;
    const file = fileInput.files[0];

    if (text) {
        sendMessage({ text: text, file: null });
        messageInput.value = '';
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            sendMessage({ text: null, file: event.target.result });
            fileInput.value = '';
        };
        reader.readAsDataURL(file);
    }
});

function sendMessage(message) {
    socket.emit('sendMessage', message);
}

function displayMessage(message) {
    const messageItem = document.createElement('li');
    messageItem.classList.add('message');

    if (message.text) {
        const textElement = document.createElement('p');
        textElement.innerText = addEmoji(markdownToHtml(message.text));
        messageItem.appendChild(textElement);
    }

    if (message.file) {
        const imgElement = document.createElement('img');
        imgElement.src = message.file;
        imgElement.alt = 'Uploaded Image';
        imgElement.style.maxWidth = '100%';
        messageItem.appendChild(imgElement);
    }

    messagesList.appendChild(messageItem);
    messagesList.scrollTop = messagesList.scrollHeight;
}

function addEmoji(text) {
    const emojiMap = {
        ':)': '😊',
        ':(': '😞',
        ':D': '😄'
    };
    let newText = text;
    for (let key in emojiMap) {
        newText = newText.replace(new RegExp(key, 'g'), emojiMap[key]);
    }
    return newText;
}

function markdownToHtml(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Bold
    text = text.replace(/\*(.*?)\*/g, '<i>$1</i>');   // Italic
    return text;
}
