const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

userInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user-message');
    userInput.value = '';

    const loadingId = appendLoading();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: text })
        });

        const data = await response.json();
        removeLoading(loadingId);
        
        if (response.ok) {
            appendMessage(data.text, 'ai-message');
        } else {
            appendMessage("Terjadi kesalahan: " + (data.error || "Gagal mendapatkan respon."), 'ai-message');
        }

    } catch (error) {
        removeLoading(loadingId);
        appendMessage("Gagal terhubung ke server backend.", 'ai-message');
    }
}

function appendMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', className);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('msg-content');
    contentDiv.innerHTML = text.replace(/\n/g, '<br>');

    msgDiv.appendChild(contentDiv);
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendLoading() {
    const id = 'loading-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.id = id;
    msgDiv.classList.add('message', 'ai-message', 'loading-msg');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('msg-content');
    contentDiv.innerHTML = '<div class="loading-bar"></div><span>MEMPROSES...</span>';

    msgDiv.appendChild(contentDiv);
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
}

function removeLoading(id) {
    const loadingDiv = document.getElementById(id);
    if (loadingDiv) {
        loadingDiv.remove();
    }
}
