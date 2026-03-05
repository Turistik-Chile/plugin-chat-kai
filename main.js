// Funcion que crea y retorna una ventanilla de chat flotante
function createChatWidget() {
    // Estilos base del widget (moderno + transiciones)
    if (!document.getElementById('chat-widget-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'chat-widget-styles';
        styleEl.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');
            :root {
                --chat-red: #ef4444;
                --chat-red-soft: #fecaca;
                --chat-red-pastel: #fee2e2;
                --chat-bg: #ffffff;
                --chat-text: #111111;
                --chat-border: #f1f1f1;
                --chat-shadow: 0 18px 40px rgba(0,0,0,0.16), 0 6px 14px rgba(0,0,0,0.1);
                --chat-radius: 20px;
            }

            #chat-button {
                background: var(--chat-red);
                border: 1px solid rgba(255,255,255,0.45);
                transition: transform 200ms ease, box-shadow 200ms ease;
            }

            #chat-button:hover {
                transform: translateY(-2px);
            }

            #chat-container {
                font-family: 'Open Sans', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 200ms ease, transform 240ms ease;
                pointer-events: none;
            }

            #chat-container.is-open {
                opacity: 1;
                transform: translateY(0);
                pointer-events: auto;
            }

            #chat-header {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 14px;
                border-bottom: 1px solid var(--chat-border);
                background: var(--chat-bg);
                border-top-left-radius: var(--chat-radius);
                border-top-right-radius: var(--chat-radius);
            }

            #chat-title {
                font-weight: 600;
                color: var(--chat-text);
                font-size: 14px;
            }

            #chat-status {
                font-size: 12px;
                color: #6b7280;
            }

            #messages-area {
                color: var(--chat-text);
                background: var(--chat-bg);
            }

            .message {
                width: fit-content;
                max-width: 78%;
                padding: 8px 10px;
                border-radius: 14px;
                margin-bottom: 8px;
                font-size: 13.5px;
                line-height: 1.4;
                box-shadow: 0 3px 10px rgba(0,0,0,0.08);
                white-space: pre-wrap;
                overflow-wrap: anywhere;
                word-break: break-word;
            }

            .message.user {
                margin-left: auto;
                margin-right: 0;
                background: #ffffff;
                color: var(--chat-text);
                border: 1px solid rgba(0,0,0,0.04);
            }

            .message.bot {
                margin-left: auto;
                margin-right: 0;
                background: #ffffff;
                color: var(--chat-text);
                border: 1px solid rgba(0,0,0,0.04);
            }

            #chat-input {
                color: var(--chat-text);
            }

            #chat-send {
                background: var(--chat-red);
            }

            #chat-send:hover {
                filter: brightness(0.96);
            }

            .icon-slot {
                width: 22px;
                height: 22px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            .icon-slot svg {
                width: 100%;
                height: 100%;
                display: block;
            }
        `;
        document.head.appendChild(styleEl);
    }

    // Crear el boton flotante (ventanilla)
    const chatButton = document.createElement('div');
    chatButton.id = 'chat-button';
    chatButton.style.position = 'fixed';
    chatButton.style.bottom = '20px';
    chatButton.style.left = '20px';
    chatButton.style.width = '56px';
    chatButton.style.height = '56px';
    chatButton.style.backgroundColor = '#d61a1a';
    chatButton.style.borderRadius = '50%';
    chatButton.style.cursor = 'pointer';
    chatButton.style.display = 'flex';
    chatButton.style.alignItems = 'center';
    chatButton.style.justifyContent = 'center';
    chatButton.style.color = 'white';
    chatButton.style.fontSize = '22px';
    chatButton.style.fontWeight = '600';
    chatButton.style.boxShadow = '0 14px 28px rgba(239,68,68,0.35), 0 6px 14px rgba(0,0,0,0.2)';
    chatButton.style.zIndex = '2147483647';
    chatButton.style.backdropFilter = 'blur(4px)';
    chatButton.innerHTML = `
        <span class="icon-slot" aria-hidden="true">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot-message-square-icon lucide-bot-message-square"><path d="M12 6V2H8"/><path d="M15 11v2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/><path d="M9 11v2"/></svg>
        </span>
    `; // Placeholder de icono

    // Crear el contenedor del chat
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    chatContainer.style.position = 'fixed';
    chatContainer.style.bottom = '90px';
    chatContainer.style.left = '20px';
    chatContainer.style.width = '340px';
    chatContainer.style.height = '460px';
    chatContainer.style.backgroundColor = 'white';
    chatContainer.style.border = '1px solid #f1f1f1';
    chatContainer.style.borderRadius = '20px';
    chatContainer.style.display = 'flex';
    chatContainer.style.flexDirection = 'column';
    chatContainer.style.boxShadow = '0 18px 40px rgba(0,0,0,0.16), 0 6px 14px rgba(0,0,0,0.1)';
    chatContainer.style.zIndex = '2147483647';

    // Header del chat
    const header = document.createElement('div');
    header.id = 'chat-header';
    header.innerHTML = `
        <span class="icon-slot" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot-icon lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        </span>
        <div>
            <div id="chat-title">Kai</div>
            <div id="chat-status">Asistente virtual de Turistik</div>
        </div>
    `;

    // Area de mensajes
    const messagesArea = document.createElement('div');
    messagesArea.id = 'messages-area';
    messagesArea.style.flex = '1';
    messagesArea.style.padding = '14px 12px';
    messagesArea.style.overflowY = 'auto';
    messagesArea.style.backgroundColor = 'white';
    messagesArea.style.color = '#111111';
    messagesArea.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    messagesArea.style.fontSize = '13.5px';
    messagesArea.style.lineHeight = '1.4';

    // Contenedor de input
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.padding = '12px';
    inputContainer.style.borderTop = '1px solid #f1f1f1';
    inputContainer.style.gap = '8px';
    inputContainer.style.background = '#fff';
    inputContainer.style.borderBottomLeftRadius = '20px';
    inputContainer.style.borderBottomRightRadius = '20px';

    const messageInput = document.createElement('input');
    messageInput.id = 'chat-input';
    messageInput.type = 'text';
    messageInput.placeholder = 'Escribe un mensaje...';
    messageInput.style.flex = '1';
    messageInput.style.padding = '10px 12px';
    messageInput.style.border = '1px solid #f1f1f1';
    messageInput.style.borderRadius = '16px';
    messageInput.style.color = '#111111';
    messageInput.style.background = '#fff5f5';
    messageInput.style.outline = 'none';

    const sendButton = document.createElement('button');
    sendButton.id = 'chat-send';
    sendButton.innerHTML = `
        <span class="icon-slot" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-horizontal-icon lucide-send-horizontal"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg>
        </span>
    `;
    sendButton.style.padding = '10px';
    sendButton.style.backgroundColor = '#d61a1a';
    sendButton.style.color = 'white';
    sendButton.style.border = 'none';
    sendButton.style.borderRadius = '14px';
    sendButton.style.cursor = 'pointer';
    sendButton.style.fontWeight = '600';
    sendButton.style.transition = 'background-color 180ms ease, transform 180ms ease';

    inputContainer.appendChild(messageInput);
    inputContainer.appendChild(sendButton);

    chatContainer.appendChild(header);
    chatContainer.appendChild(messagesArea);
    chatContainer.appendChild(inputContainer);

    // Funcion para enviar mensaje
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user';
            messageDiv.textContent = message;
            messagesArea.appendChild(messageDiv);
            messageInput.value = '';
            messagesArea.scrollTop = messagesArea.scrollHeight;
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
        chatContainer.classList.toggle('is-open', isOpen);
    });

    // Agregar al body
    document.body.appendChild(chatButton);
    document.body.appendChild(chatContainer);

    // Retornar el boton (la ventanilla)
    return chatButton;
}

// Llamar a la funcion para crear la ventanilla
createChatWidget();
