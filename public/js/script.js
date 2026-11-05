async function sendMessage() {
    const inputField = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const text = inputField.value.trim();

    if (!text) return;

    // Append User Message
    appendMessage(text, 'user');
    inputField.value = '';

    // Create Temporary Loading Message
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot';
    loadingDiv.innerText = 'Thinking...';
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        chatBox.removeChild(loadingDiv);

        if (data.reply) {
            appendMessage(data.reply, 'bot');
        } else {
            appendMessage('Error: Unexpected response format', 'bot');
        }
    } catch (error) {
        chatBox.removeChild(loadingDiv);
        appendMessage('Error connecting to backend server.', 'bot');
        console.error(error);
    }
}

function appendMessage(text, sender) {
    const chatBox = document.getElementById('chatBox');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}