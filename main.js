// Función que crea y retorna una ventanilla de chat flotante
function createChatWidget() {
    // Crear el botón flotante (ventanilla)
    const chatButton = document.createElement('div');
    chatButton.id = 'chat-button';
    chatButton.style.position = 'fixed';
    chatButton.style.bottom = '20px';
    chatButton.style.left = '20px';
    chatButton.style.width = '60px';
    chatButton.style.height = '60px';
    chatButton.style.backgroundColor = 'red';
    chatButton.style.borderRadius = '50%';
    chatButton.style.cursor = 'pointer';
    chatButton.style.display = 'flex';
    chatButton.style.alignItems = 'center';
    chatButton.style.justifyContent = 'center';
    chatButton.style.color = 'white';
    chatButton.style.fontSize = '24px';
    chatButton.style.fontWeight = 'bold';
    chatButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    chatButton.style.zIndex = '2147483647';
    chatButton.innerHTML = '💬'; // Ícono de chat

    // Crear el contenedor del chat
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    chatContainer.style.position = 'fixed';
    chatContainer.style.bottom = '90px';
    chatContainer.style.left = '20px';
    chatContainer.style.width = '300px';
    chatContainer.style.height = '400px';
    chatContainer.style.backgroundColor = 'white';
    chatContainer.style.border = '2px solid red';
    chatContainer.style.borderRadius = '10px';
    chatContainer.style.display = 'none'; // Inicialmente oculto
    chatContainer.style.flexDirection = 'column';
    chatContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    chatContainer.style.zIndex = '2147483647';

    // Área de mensajes
    const messagesArea = document.createElement('div');
    messagesArea.id = 'messages-area';
    messagesArea.style.flex = '1';
    messagesArea.style.padding = '10px';
    messagesArea.style.overflowY = 'auto';
    messagesArea.style.backgroundColor = 'white';
    messagesArea.style.color = 'red';

    // Contenedor de input
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.padding = '10px';
    inputContainer.style.borderTop = '1px solid red';

    const messageInput = document.createElement('input');
    messageInput.type = 'text';
    messageInput.placeholder = 'Escribe un mensaje...';
    messageInput.style.flex = '1';
    messageInput.style.padding = '5px';
    messageInput.style.border = '1px solid red';
    messageInput.style.borderRadius = '5px';
    messageInput.style.color = 'red';

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Enviar';
    sendButton.style.marginLeft = '5px';
    sendButton.style.padding = '5px 10px';
    sendButton.style.backgroundColor = 'red';
    sendButton.style.color = 'white';
    sendButton.style.border = 'none';
    sendButton.style.borderRadius = '5px';
    sendButton.style.cursor = 'pointer';

    inputContainer.appendChild(messageInput);
    inputContainer.appendChild(sendButton);

    chatContainer.appendChild(messagesArea);
    chatContainer.appendChild(inputContainer);

    // Función para enviar mensaje
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = 'Tú: ' + message;
            messageDiv.style.marginBottom = '5px';
            messageDiv.style.color = 'red';
            messagesArea.appendChild(messageDiv);
            messageInput.value = '';
            messagesArea.scrollTop = messagesArea.scrollHeight;
            // Aquí podrías agregar lógica para responder, pero por ahora solo muestra el mensaje
        }
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Evento para abrir/cerrar el chat
    let isOpen = false;
    chatButton.addEventListener('click', () => {
        isOpen = !isOpen;
        chatContainer.style.display = isOpen ? 'flex' : 'none';
    });

    // Agregar al body
    document.body.appendChild(chatButton);
    document.body.appendChild(chatContainer);

    // Retornar el botón (la ventanilla)
    return chatButton;
}

// Llamar a la funciÃ³n para crear la ventanilla
createChatWidget();

