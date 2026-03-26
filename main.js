// Funcion que crea y retorna una ventanilla de chat flotante
function createChatWidget() {
    if (!document.getElementById('chat-widget-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'chat-widget-styles';
        styleEl.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');

            :root {
                --chat-red: #d61a1a;
                --chat-red-soft: #fecaca;
                --chat-red-pastel: #fee2e2;
                --chat-bg: rgba(255, 255, 255, 0.8);
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
                transition: opacity 200ms ease, transform 240ms ease, height 240ms ease;
                pointer-events: none;
                background: var(--chat-bg);
                backdrop-filter: blur(6px);
                width: min(340px, calc(100vw - 32px));
                height: min(460px, calc(100vh - 140px));
                max-height: calc(100vh - 140px);
            }

            #chat-container.is-open {
                opacity: 1;
                transform: translateY(0);
                pointer-events: auto;
            }

            @media (max-width: 520px) {
                #chat-container {
                    left: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                    width: 100% !important;
                    height: 33vh !important;
                    border-bottom-left-radius: 0 !important;
                    border-bottom-right-radius: 0 !important;
                    background: var(--chat-bg) !important;
                    backdrop-filter: blur(6px) !important;
                }
                #chat-container.is-expanded {
                    height: 75vh !important;
                }

                #chat-header {
                    background: #ffffff !important;
                    border-bottom: 1px solid var(--chat-border) !important;
                }

                #chat-title,
                #chat-status {
                    color: #111111 !important;
                }

                #chat-header .icon-slot svg {
                    color: #111111 !important;
                }

                #chat-close,
                #chat-expand {
                    color: #111111 !important;
                }

                #chat-expand,
                #chat-close {
                    display: inline-flex !important;
                    align-items: center;
                    justify-content: center;
                }
            }

            #chat-header {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 14px;
                border-bottom: 1px solid rgba(255,255,255,0.25);
                background: var(--chat-red);
                border-top-left-radius: var(--chat-radius);
                border-top-right-radius: var(--chat-radius);
            }

            #chat-close {
                margin-left: auto;
                border: none;
                background: transparent;
                color: #111111;
                font-size: 18px;
                cursor: pointer;
                padding: 4px 6px;
                border-radius: 8px;
                display: none;
            }

            #chat-expand {
                margin-left: 0;
                border: none;
                background: transparent;
                color: #ffffff;
                font-size: 18px;
                cursor: pointer;
                padding: 4px 2px;
                border-radius: 8px;
                display: none;
            }

            #chat-expand:hover {
                background: rgba(0,0,0,0.08);
            }

            #chat-close {
                margin-left: 0;
                padding-left: 2px;
            }

            #chat-close:hover {
                background: rgba(0,0,0,0.06);
            }

            #chat-title {
                font-weight: 600;
                color: #ffffff;
                font-size: 14px;
            }

            #chat-status {
                font-size: 12px;
                color: rgba(255,255,255,0.8);
                font-weight: 600;
            }

            #messages-area {
                color: var(--chat-text);
                background: var(--chat-bg);
                min-height: 0;
            }

            .chat-spinner {
                width: 22px;
                height: 22px;
                border-radius: 50%;
                border: 3px solid rgba(214,26,26,0.2);
                border-top-color: var(--chat-red);
                animation: spinner-rotate 0.9s linear infinite;
            }

            .chat-loading {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 100%;
            }

            @keyframes spinner-rotate {
                to { transform: rotate(360deg); }
            }

            .typing-dot {
                width: 7px;
                height: 7px;
                display: inline-block;
                background: var(--chat-red);
                border-radius: 50%;
                opacity: 0.35;
                animation: typing-bounce 0.9s infinite ease-in-out;
            }

            .typing-dot:nth-child(2) { animation-delay: 0.15s; }
            .typing-dot:nth-child(3) { animation-delay: 0.3s; }

            @keyframes typing-bounce {
                0%, 80%, 100% { transform: translateY(0) scale(0.9); opacity: 0.35; }
                40% { transform: translateY(-4px) scale(1); opacity: 0.9; }
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
                opacity: 0;
                transform: translateY(6px);
                animation: message-fade-in 220ms ease-out forwards;
            }

            .message.typing-indicator {
                padding: 6px 10px;
                line-height: 1;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                min-height: 0;
            }

            .message.user {
                margin-left: auto;
                margin-right: 0;
                background: #ffffff;
                color: var(--chat-text);
                border: 1px solid rgba(0,0,0,0.04);
                position: relative;
                padding-bottom: 16px;
            }

            .message-text {
                display: block;
            }

            .message-status {
                position: absolute;
                right: 6px;
                bottom: 4px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 1px;
                font-size: 9px;
                line-height: 1;
                color: #94a3b8;
            }

            .message-status.status-read {
                color: #38bdf8;
            }

            .message-status .check + .check {
                margin-left: -3px;
            }

            .message.bot {
                margin-left: 0;
                margin-right: auto;
                background: transparent;
                color: var(--chat-text);
                border: none;
                box-shadow: none;
                padding: 0;
            }

            .message.bot a {
                color: #b91c1c;
                text-decoration: underline;
            }

            .message.bot code {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                font-size: 12.5px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                padding: 1px 4px;
                white-space: break-spaces;
            }

            .message.bot pre {
                margin: 8px 0 10px;
                padding: 10px 12px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                overflow-x: auto;
                white-space: pre-wrap;
            }

            .message.bot pre code {
                padding: 0;
                border: none;
                background: transparent;
                font-size: 12.5px;
            }

            .message.bot p {
                margin: 0 0 10px;
            }

            .message.bot ul,
            .message.bot ol {
                margin: 0 0 10px 18px;
                padding-left: 18px;
            }

            .message.bot li {
                margin: 0 0 4px;
            }

            .message.bot strong {
                font-weight: 600;
            }

            .message.bot em {
                font-style: italic;
            }

            @keyframes message-fade-in {
                from { opacity: 0; transform: translateY(6px); }
                to { opacity: 1; transform: translateY(0); }
            }

            #chat-input {
                color: var(--chat-text);
            }

            #chat-send {
                background: var(--chat-red);
                position: relative;
            }

            #chat-send:hover {
                filter: brightness(0.96);
            }

            #chat-send.is-cooldown {
                background: #9ca3af;
                filter: none;
                cursor: not-allowed;
            }

            #chat-send.is-cooldown::after {
                content: attr(data-cooldown);
                position: absolute;
                top: -6px;
                right: -6px;
                background: #ffffff;
                color: #b91c1c;
                border-radius: 10px;
                padding: 2px 5px;
                font-size: 10px;
                font-weight: 600;
                line-height: 1;
                box-shadow: 0 6px 14px rgba(0,0,0,0.18);
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
                color: #ffffff;
            }

            .lang-picker {
                position: relative;
                display: inline-flex;
                align-items: center;
                margin-left: auto;
            }

            .flag-button,
            .flag-option {
                width: 26px;
                height: 18px;
                border-radius: 4px;
                border: 1px solid rgba(255,255,255,0.6);
                cursor: pointer;
                padding: 0;
                background-color: transparent;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }

            .flag-button:focus-visible,
            .flag-option:focus-visible {
                outline: 2px solid #ffffff;
                outline-offset: 2px;
            }

            .flag-menu {
                position: absolute;
                right: calc(100% + 8px);
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                gap: 6px;
                padding: 4px;
                background: rgba(255,255,255,0.95);
                border-radius: 10px;
                box-shadow: 0 10px 24px rgba(0,0,0,0.18);
                opacity: 0;
                pointer-events: none;
                transition: opacity 160ms ease, transform 160ms ease;
            }

            .flag-menu.is-open {
                opacity: 1;
                pointer-events: auto;
                transform: translateY(-50%) translateX(-2px);
            }

            .flag-es {
                background-image: url('https://flagcdn.com/w40/es.png');
            }

            .flag-us {
                background-image: url('https://flagcdn.com/w40/us.png');
            }

            .flag-br {
                background-image: url('https://flagcdn.com/w40/br.png');
            }
        `;
        document.head.appendChild(styleEl);
    }

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
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6V2H8"/><path d="M15 11v2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/><path d="M9 11v2"/></svg>
        </span>
    `;

    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    chatContainer.style.position = 'fixed';
    chatContainer.style.bottom = '90px';
    chatContainer.style.left = '20px';
    chatContainer.style.width = '340px';
    chatContainer.style.height = '460px';
    chatContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    chatContainer.style.border = '1px solid #f1f1f1';
    chatContainer.style.borderRadius = '20px';
    chatContainer.style.display = 'flex';
    chatContainer.style.flexDirection = 'column';
    chatContainer.style.boxShadow = '0 18px 40px rgba(0,0,0,0.16), 0 6px 14px rgba(0,0,0,0.1)';
    chatContainer.style.zIndex = '2147483647';

    const header = document.createElement('div');
    header.id = 'chat-header';
    header.style.background = 'var(--chat-red)';
    header.style.backdropFilter = 'none';
    header.innerHTML = `
        <span class="icon-slot" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        </span>
        <div>
            <div id="chat-title">Kai</div>
            <div id="chat-status">Asistente virtual de Turistik</div>
        </div>
        <div class="lang-picker">
            <button id="lang-current" class="flag-button flag-es" type="button" aria-label="Idioma: Español"></button>
            <div id="lang-menu" class="flag-menu" role="menu" aria-hidden="true"></div>
        </div>
        <button id="chat-expand" type="button" aria-label="Expandir chat">▲</button>
        <button id="chat-close" type="button" aria-label="Cerrar chat">✕</button>
    `;

    const messagesArea = document.createElement('div');
    messagesArea.id = 'messages-area';
    messagesArea.style.flex = '1';
    messagesArea.style.padding = '14px 12px';
    messagesArea.style.overflowY = 'auto';
    messagesArea.style.backgroundColor = 'transparent';
    messagesArea.style.color = '#111111';
    messagesArea.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    messagesArea.style.fontSize = '13.5px';
    messagesArea.style.lineHeight = '1.4';

    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.padding = '12px';
    inputContainer.style.borderTop = '1px solid #f1f1f1';
    inputContainer.style.gap = '8px';
    inputContainer.style.background = 'transparent';
    inputContainer.style.borderBottomLeftRadius = '20px';
    inputContainer.style.borderBottomRightRadius = '20px';

    const messageInput = document.createElement('textarea');
    messageInput.id = 'chat-input';
    messageInput.placeholder = 'Escribe un mensaje...';
    messageInput.style.flex = '1';
    messageInput.style.padding = '10px 12px';
    messageInput.style.border = '1px solid #f1f1f1';
    messageInput.style.borderRadius = '16px';
    messageInput.style.color = '#111111';
    messageInput.style.background = '#fff5f5';
    messageInput.style.outline = 'none';
    messageInput.rows = 1;
    messageInput.style.resize = 'none';
    messageInput.style.lineHeight = '1.35';

    const sendButton = document.createElement('button');
    sendButton.id = 'chat-send';
    sendButton.innerHTML = `
        <span class="icon-slot" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg>
        </span>
    `;
    sendButton.style.backgroundColor = '#d61a1a';
    sendButton.style.color = 'white';
    sendButton.style.border = 'none';
    sendButton.style.borderRadius = '14px';
    sendButton.style.cursor = 'pointer';
    sendButton.style.fontWeight = '500';
    sendButton.style.transition = 'background-color 180ms ease, transform 180ms ease';
    sendButton.style.display = 'inline-flex';
    sendButton.style.alignItems = 'center';
    sendButton.style.justifyContent = 'center';
    sendButton.style.lineHeight = '0';
    sendButton.style.padding = '8px';
    sendButton.style.minWidth = '0';

    inputContainer.appendChild(messageInput);
    inputContainer.appendChild(sendButton);

    chatContainer.appendChild(header);
    chatContainer.appendChild(messagesArea);
    chatContainer.appendChild(inputContainer);

    let isOpen = false;
    let memoryLoaded = false;
    let activeAbortController = null;
    let selectedLanguage = 'ESP';
    let lastSendAt = 0;
    let cooldownUntil = 0;
    let cooldownInterval = null;
    const COOLDOWN_MS = 10000;

    const LANG_OPTIONS = {
        ESP: { className: 'flag-es', label: 'Idioma: Español' },
        ENG: { className: 'flag-us', label: 'Language: English' },
        POR: { className: 'flag-br', label: 'Idioma: Português' }
    };

    const langPicker = header.querySelector('.lang-picker');
    const langCurrent = header.querySelector('#lang-current');
    const langMenu = header.querySelector('#lang-menu');

    function applyLanguage(lang) {
        selectedLanguage = lang;
        if (!langCurrent) return;
        langCurrent.classList.remove('flag-es', 'flag-us', 'flag-br');
        const option = LANG_OPTIONS[lang];
        if (!option) return;
        langCurrent.classList.add(option.className);
        langCurrent.setAttribute('aria-label', option.label);
    }

    function renderLangMenu() {
        if (!langMenu) return;
        const options = Object.entries(LANG_OPTIONS)
            .filter(([lang]) => lang !== selectedLanguage)
            .map(([lang, option]) => {
                return `<button class="flag-option ${option.className}" type="button" data-lang="${lang}" aria-label="${option.label}"></button>`;
            })
            .join('');
        langMenu.innerHTML = options;
    }

    function setMenuOpen(isOpenMenu) {
        if (!langMenu) return;
        langMenu.classList.toggle('is-open', isOpenMenu);
        langMenu.setAttribute('aria-hidden', isOpenMenu ? 'false' : 'true');
        if (isOpenMenu) {
            renderLangMenu();
        }
    }

    if (langCurrent && langMenu) {
        langCurrent.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpenMenu = langMenu.classList.contains('is-open');
            setMenuOpen(!isOpenMenu);
        });

        langMenu.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            const lang = target.getAttribute('data-lang');
            if (!lang) return;
            applyLanguage(lang);
            setMenuOpen(false);
        });

        document.addEventListener('click', (event) => {
            if (!langPicker) return;
            if (langPicker.contains(event.target)) return;
            setMenuOpen(false);
        });
    }

    const closeButton = header.querySelector('#chat-close');
    const expandButton = header.querySelector('#chat-expand');
    if (closeButton) {
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            isOpen = false;
            chatContainer.classList.remove('is-open');
        });
    }
    if (expandButton) {
        expandButton.addEventListener('click', (event) => {
            event.stopPropagation();
            chatContainer.classList.toggle('is-expanded');
            const isExpanded = chatContainer.classList.contains('is-expanded');
            expandButton.textContent = isExpanded ? '▼' : '▲';
            expandButton.setAttribute(
                'aria-label',
                isExpanded ? 'Contraer chat' : 'Expandir chat'
            );
        });
    }

    const endpointUrl = 'https://kaimcp-a9h3ccb5fngxhmag.eastus-01.azurewebsites.net/api/uid_memoria';
    const chatUrl = 'https://kaimcp-a9h3ccb5fngxhmag.eastus-01.azurewebsites.net/api/kai_chat_web';
    const DEBUG_SSE = false;

    function updateCooldownUi() {
        const remaining = Math.max(0, cooldownUntil - Date.now());
        if (remaining <= 0) {
            sendButton.classList.remove('is-cooldown');
            sendButton.removeAttribute('data-cooldown');
            sendButton.setAttribute('aria-label', 'Enviar mensaje');
            sendButton.style.backgroundColor = '#d61a1a';
            sendButton.disabled = false;
            return;
        }

        const seconds = Math.ceil(remaining / 1000);
        sendButton.classList.add('is-cooldown');
        sendButton.setAttribute('data-cooldown', `${seconds}s`);
        sendButton.setAttribute('aria-label', `Enviar mensaje. Espera ${seconds} segundos`);
        sendButton.style.backgroundColor = '#9ca3af';
        sendButton.disabled = true;
    }

    function startCooldownTimer() {
        cooldownUntil = Date.now() + COOLDOWN_MS;
        updateCooldownUi();
        if (cooldownInterval) {
            clearInterval(cooldownInterval);
        }
        cooldownInterval = setInterval(() => {
            updateCooldownUi();
            if (Date.now() >= cooldownUntil) {
                clearInterval(cooldownInterval);
                cooldownInterval = null;
                updateCooldownUi();
            }
        }, 250);
    }

    function isCooldownActive() {
        const now = Date.now();
        return now < cooldownUntil || now - lastSendAt < COOLDOWN_MS;
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
    }

    function setCookie(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
    }

    function showSkeleton() {
        messagesArea.innerHTML = `
            <div class="chat-loading" aria-hidden="true">
                <div class="chat-spinner"></div>
            </div>
        `;
    }

    function removeSkeleton() {
        const loader = messagesArea.querySelector('.chat-loading');
        if (loader) messagesArea.innerHTML = '';
    }

    function clearMessages() {
        messagesArea.innerHTML = '';
    }

    function scrollToBottom() {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function appendMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        if (type === 'bot') {
            messageDiv.innerHTML = renderMarkdownStreaming(text);
        } else {
            const textDiv = document.createElement('div');
            textDiv.className = 'message-text';
            textDiv.textContent = text;
            messageDiv.appendChild(textDiv);

            if (type === 'user') {
                const statusDiv = document.createElement('div');
                statusDiv.className = 'message-status status-sent';
                statusDiv.setAttribute('aria-hidden', 'true');
                statusDiv.innerHTML = '<span class="check">✓</span>';
                messageDiv.appendChild(statusDiv);
            }
        }
        messagesArea.appendChild(messageDiv);
        return messageDiv;
    }

    function updateMessageStatus(messageEl, status) {
        if (!messageEl) return;
        const statusEl = messageEl.querySelector('.message-status');
        if (!statusEl) return;

        statusEl.className = `message-status status-${status}`;
        if (status === 'sent') {
            statusEl.innerHTML = '<span class="check">✓</span>';
        } else {
            statusEl.innerHTML = '<span class="check">✓</span><span class="check">✓</span>';
        }
    }

    function showTypingIndicator() {
        removeTypingIndicator();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.setAttribute('aria-label', 'Cargando');
        typingDiv.innerHTML = `
            <div>  </div>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;
        messagesArea.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }

    async function loadMemory() {
        const existingUid = (getCookie('kai_uid') || '').trim();

        try {
            if (!existingUid) {
                const res = await fetch(endpointUrl, { method: 'GET' });
                if (!res.ok) throw new Error(`GET uid failed: ${res.status}`);

                const data = await res.json();
                if (data && data.uid) {
                    setCookie('kai_uid', data.uid);
                }
                removeSkeleton();
            } else {
                const res = await fetch(endpointUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid: existingUid })
                });

                if (!res.ok) throw new Error(`POST memoria failed: ${res.status}`);

                const data = await res.json();
                if (data && Array.isArray(data.memoria_corta)) {
                    clearMessages();
                    data.memoria_corta.forEach((item) => {
                        if (item.mensaje_usuario) {
                            const userMessageEl = appendMessage(item.mensaje_usuario, 'user');
                            updateMessageStatus(userMessageEl, 'read');
                        }
                        if (item.mensaje_bot) appendMessage(item.mensaje_bot, 'bot');
                    });
                    scrollToBottom();
                } else {
                    removeSkeleton();
                }
            }
        } catch (err) {
            removeSkeleton();
            console.error('Error cargando memoria:', err);
        } finally {
            memoryLoaded = true;
        }
    }

    function parseBooleanParam(value) {
        if (value == null) return null;
        const normalized = String(value).trim().toLowerCase();
        if (normalized === 'true') return true;
        if (normalized === 'false') return false;
        return null;
    }

    let autoMessageHandled = false;
    function handleAutoMessageFromUrl() {
        if (autoMessageHandled) return;

        const params = new URLSearchParams(window.location.search);
        const uidParam = params.get('uid');
        const autorizadoParam = params.get('autorizado');
        const autorizado = parseBooleanParam(autorizadoParam);

        const hasAutoParams = uidParam !== null || autorizadoParam !== null;

        if (uidParam) {
            setCookie('kai_uid', uidParam);
        }

        if (hasAutoParams && !isOpen) {
            isOpen = true;
            chatContainer.classList.add('is-open');
        }

        if (autorizado === null) return;
        autoMessageHandled = true;

        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const texto = autorizado
                ? 'Tu pago fue autorizado'
                : 'Hubo un error con la autorización del pago';
            appendMessage(texto, 'bot');
            scrollToBottom();
        }, 2200);
    }

    function createBotMessageElement() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.innerHTML = '';
        messagesArea.appendChild(messageDiv);
        return messageDiv;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function sanitizeUrl(rawUrl) {
        try {
            const parsed = new URL(rawUrl, window.location.origin);
            if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
                return parsed.href;
            }
        } catch (err) {
            return '';
        }
        return '';
    }

    function parseInline(text) {
        let result = escapeHtml(text);

        const linkPlaceholders = [];

        function stashLink(html) {
            const token = `\u0000LINK${linkPlaceholders.length}\u0000`;
            linkPlaceholders.push(html);
            return token;
        }

        result = result.replace(/\(Link de compra\)\s+(https?:\/\/\S+)/gi, (match, url) => {
            const safeUrl = sanitizeUrl(url);
            if (!safeUrl) return match;
            return stashLink(`<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">Link de compra</a>`);
        });

        result = result.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, url) => {
            const safeLabel = escapeHtml(label);
            const safeUrl = sanitizeUrl(url);
            if (!safeUrl) return safeLabel;
            return stashLink(`<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`);
        });

        result = result.replace(/(https?:\/\/[^\s<]+)/g, (match) => {
            const safeUrl = sanitizeUrl(match);
            if (!safeUrl) return match;
            return stashLink(`<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeUrl}</a>`);
        });

        result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
        result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        result = result.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        result = result.replace(/(^|[\\s(>])\*([^*]+)\*(?=[\\s.,;:!?)]|$)/g, '$1<em>$2</em>');
        result = result.replace(/(^|[\\s(>])_([^_]+)_(?=[\\s.,;:!?)]|$)/g, '$1<em>$2</em>');
        result = result.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

        result = result.replace(/\u0000LINK(\d+)\u0000/g, (match, idx) => {
            return linkPlaceholders[Number(idx)] || '';
        });

        return result;
    }

    function renderMarkdown(rawText) {
        if (!rawText) return '';

        const normalized = String(rawText)
            .replace(/\r\n/g, '\n')
            .replace(/^\.\s+/gm, '- ')
            .replace(/^•\s+/gm, '- ');
        const lines = normalized.split('\n');
        const html = [];

        let inCodeBlock = false;
        let codeLang = '';
        let codeLines = [];
        let inList = false;
        let listType = null;
        let paragraphLines = [];

        function flushParagraph() {
            if (!paragraphLines.length) return;
            const paragraphText = paragraphLines.join('<br>');
            html.push(`<p>${paragraphText}</p>`);
            paragraphLines = [];
        }

        function flushList() {
            if (!inList) return;
            html.push(listType === 'ol' ? '</ol>' : '</ul>');
            inList = false;
            listType = null;
        }

        function flushCodeBlock() {
            const safeCode = escapeHtml(codeLines.join('\n'));
            const safeLang = escapeHtml(codeLang.trim());
            const className = safeLang ? ` class="language-${safeLang}"` : '';
            html.push(`<pre><code${className}>${safeCode}</code></pre>`);
            codeLines = [];
            codeLang = '';
        }

        for (let i = 0; i < lines.length; i += 1) {
            const line = lines[i];

            if (inCodeBlock) {
                if (line.startsWith('```')) {
                    flushCodeBlock();
                    inCodeBlock = false;
                } else {
                    codeLines.push(line);
                }
                continue;
            }

            if (line.startsWith('```')) {
                flushParagraph();
                flushList();
                inCodeBlock = true;
                codeLang = line.slice(3).trim();
                codeLines = [];
                continue;
            }

            const trimmed = line.trim();

            if (!trimmed) {
                flushParagraph();
                flushList();
                continue;
            }

            const ulMatch = trimmed.match(/^[-*]\s+(.*)$/);
            const olMatch = trimmed.match(/^\d+\.\s+(.*)$/);

            if (ulMatch) {
                flushParagraph();
                if (!inList || listType !== 'ul') {
                    flushList();
                    html.push('<ul>');
                    inList = true;
                    listType = 'ul';
                }
                html.push(`<li>${parseInline(ulMatch[1])}</li>`);
                continue;
            }

            if (olMatch) {
                flushParagraph();
                if (!inList || listType !== 'ol') {
                    flushList();
                    html.push('<ol>');
                    inList = true;
                    listType = 'ol';
                }
                html.push(`<li>${parseInline(olMatch[1])}</li>`);
                continue;
            }

            flushList();
            paragraphLines.push(parseInline(line));
        }

        flushParagraph();
        flushList();

        if (inCodeBlock) {
            flushCodeBlock();
        }

        return html.join('');
    }

    function renderMarkdownStreaming(rawText) {
        let text = String(rawText);

        const fenceCount = (text.match(/```/g) || []).length;
        if (fenceCount % 2 === 1) {
            text += '\n```';
        }

        const inlineTickCount = (text.replace(/```[\s\S]*?```/g, '').match(/`/g) || []).length;
        if (inlineTickCount % 2 === 1) {
            text += '`';
        }

        return renderMarkdown(text);
    }

    function createSseParser(onEvent) {
        let buffer = '';
        let eventName = 'message';
        let dataLines = [];

        function dispatchEvent() {
            if (!dataLines.length) {
                eventName = 'message';
                return;
            }

            const data = dataLines.join('\n');
            onEvent({
                event: eventName || 'message',
                data
            });

            eventName = 'message';
            dataLines = [];
        }

        return {
            feed(chunk) {
                buffer += chunk;

                while (true) {
                    const lineEnd = buffer.indexOf('\n');
                    if (lineEnd === -1) break;

                    let line = buffer.slice(0, lineEnd);
                    buffer = buffer.slice(lineEnd + 1);

                    if (line.endsWith('\r')) {
                        line = line.slice(0, -1);
                    }

                    if (line === '') {
                        dispatchEvent();
                        continue;
                    }

                    if (line.startsWith(':')) {
                        continue;
                    }

                    if (line.startsWith('event:')) {
                        eventName = line.slice(6).trim() || 'message';
                        continue;
                    }

                    if (line.startsWith('data:')) {
                        let value = line.slice(5);
                        if (value.startsWith(' ')) value = value.slice(1);
                        dataLines.push(value);
                    }
                }
            },

            flush() {
                if (dataLines.length) {
                    dispatchEvent();
                }
            }
        };
    }

    function extractTextDelta(payload, eventName) {
        if (typeof payload === 'string') return payload;
        if (typeof payload === 'number') return String(payload);
        if (!payload || typeof payload !== 'object') return '';

        if (typeof payload.delta === 'string' || typeof payload.delta === 'number') return String(payload.delta);
        if (typeof payload.text === 'string' || typeof payload.text === 'number') return String(payload.text);

        if (typeof payload.content === 'string' || typeof payload.content === 'number') return String(payload.content);

        if (payload.type && typeof payload.type === 'string') {
            if (payload.type.includes('delta') && (typeof payload.delta === 'string' || typeof payload.delta === 'number')) {
                return String(payload.delta);
            }
            if (payload.type.includes('text') && (typeof payload.text === 'string' || typeof payload.text === 'number')) {
                return String(payload.text);
            }
        }

        if (Array.isArray(payload.delta)) {
            return payload.delta
                .map((item) => {
                    if (typeof item === 'string' || typeof item === 'number') return String(item);
                    if (item && typeof item.text === 'string') return item.text;
                    if (item && typeof item.delta === 'string') return item.delta;
                    if (item && typeof item.text === 'number') return String(item.text);
                    if (item && typeof item.delta === 'number') return String(item.delta);
                    return '';
                })
                .join('');
        }

        if (Array.isArray(payload.output)) {
            return payload.output
                .map((item) => {
                    if (!item || typeof item !== 'object') return '';
                    if (typeof item.text === 'string' || typeof item.text === 'number') return String(item.text);
                    if (typeof item.delta === 'string' || typeof item.delta === 'number') return String(item.delta);
                    if (Array.isArray(item.content)) {
                        return item.content
                            .map((part) => {
                                if (!part || typeof part !== 'object') return '';
                                if (typeof part.text === 'string' || typeof part.text === 'number') return String(part.text);
                                if (typeof part.delta === 'string' || typeof part.delta === 'number') return String(part.delta);
                                return '';
                            })
                            .join('');
                    }
                    return '';
                })
                .join('');
        }

        if (eventName === 'message' && typeof payload.message === 'string') {
            return payload.message;
        }

        return '';
    }

    function debugLogChunk(info) {
        if (!DEBUG_SSE) return;
        try {
            console.log('SSE debug:', info);
        } catch (err) {
            // no-op
        }
    }

    function parseMaybeJson(data) {
        try {
            return JSON.parse(data);
        } catch (err) {
            return data;
        }
    }

    function extractBodyText(bodyText) {
        const parsed = parseMaybeJson(bodyText);
        const extracted = extractTextDelta(parsed, 'message');
        if (extracted) return extracted;

        if (parsed && typeof parsed === 'object') {
            const values = Object.values(parsed)
                .filter((value) => typeof value === 'string' && value.trim());
            if (values.length) return values.join('\n');
        }

        return typeof bodyText === 'string' ? bodyText : '';
    }

    async function streamResponseToElement(response, messageEl, onChunk) {
        const contentType = response.headers.get('content-type') || '';
        const isSse = contentType.includes('text/event-stream');

        if (!response.body || !isSse) {
            const text = await response.text();
            if (text) {
                const bodyText = extractBodyText(text);
                messageEl.innerHTML = renderMarkdownStreaming(bodyText);
            }
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let displayText = '';
        let pendingText = '';
        let renderTimer = null;
        let doneReceived = false;
        let streamErrored = false;
        const STREAM_CHARS_PER_TICK = 1;
        const STREAM_CHAR_DELAY_MS = 10;

        function startRenderTimer() {
            if (renderTimer) return;
            renderTimer = setInterval(() => {
                if (!pendingText) {
                    clearInterval(renderTimer);
                    renderTimer = null;
                    return;
                }

                const slice = pendingText.slice(0, STREAM_CHARS_PER_TICK);
                pendingText = pendingText.slice(STREAM_CHARS_PER_TICK);
                displayText += slice;
                messageEl.innerHTML = renderMarkdownStreaming(displayText);
                scrollToBottom();
            }, STREAM_CHAR_DELAY_MS);
        }

        const parser = createSseParser(({ event, data }) => {
            if (DEBUG_SSE) {
                console.log('SSE event:', event, 'data:', data);
            }

            debugLogChunk({
                stage: 'raw-event',
                event,
                data,
                dataType: typeof data
            });

            if (event === 'done') {
                doneReceived = true;
                return;
            }

            if (event === 'error') {
                const payload = parseMaybeJson(data);
                const message =
                    payload && typeof payload === 'object' && typeof payload.message === 'string'
                        ? payload.message
                        : typeof payload === 'string'
                            ? payload
                            : 'Ocurrió un error al recibir la respuesta.';

                messageEl.textContent = message;
                streamErrored = true;
                return;
            }

            const payload = parseMaybeJson(data);
            debugLogChunk({
                stage: 'parsed',
                event,
                payload,
                payloadType: typeof payload
            });

            const deltaText = extractTextDelta(payload, event);
            debugLogChunk({
                stage: 'delta',
                event,
                deltaText,
                deltaType: typeof deltaText
            });

            if (deltaText) {
                pendingText += deltaText;
                startRenderTimer();

                if (onChunk) {
                    onChunk(deltaText, { event, payload });
                }

                scrollToBottom();
            }
        });

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            if (chunk) {
                if (DEBUG_SSE) {
                    console.log('SSE raw chunk:', JSON.stringify(chunk));
                }
                parser.feed(chunk);
            }

            if (doneReceived || streamErrored) {
                break;
            }
        }

        const tail = decoder.decode();
        if (tail) {
            parser.feed(tail);
        }

        parser.flush();

        if (pendingText && !renderTimer) {
            startRenderTimer();
        }

    }

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        if (isCooldownActive()) {
            return;
        }

        const userMessageEl = appendMessage(message, 'user');
        messageInput.value = '';
        scrollToBottom();

        lastSendAt = Date.now();
        startCooldownTimer();

        const uid = (getCookie('kai_uid') || '').trim();
        updateMessageStatus(userMessageEl, 'delivered');

        const statusTimers = [];
        let typingIndicatorTimer = null;
        let responseStarted = false;

        statusTimers.push(setTimeout(() => updateMessageStatus(userMessageEl, 'read'), 3000));
        typingIndicatorTimer = setTimeout(() => {
            if (!responseStarted) {
                showTypingIndicator();
            }
        }, 6000);

        let botMessageEl = null;
        const requestStart = performance.now();
        let firstChunkAt = 0;
        let totalChunks = 0;
        let hasStarted = false;

        try {
            activeAbortController = new AbortController();

            const res = await fetch(chatUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid,
                    mensaje: message,
                    origen: window.location.href,
                    idioma: selectedLanguage
                }),
                signal: activeAbortController.signal
            });

            if (!res.ok) {
                throw new Error(`POST kai_chat_web failed: ${res.status}`);
            }

            botMessageEl = createBotMessageElement();

            await streamResponseToElement(res, botMessageEl, () => {
                totalChunks += 1;

                if (!firstChunkAt) {
                    firstChunkAt = performance.now();
                    const delta = Math.round(firstChunkAt - requestStart);
                    console.log(`Streaming: primer evento con texto en ${delta}ms`);
                }

                if (!hasStarted) {
                    hasStarted = true;
                    responseStarted = true;
                    if (typingIndicatorTimer) {
                        clearTimeout(typingIndicatorTimer);
                        typingIndicatorTimer = null;
                    }
                    removeTypingIndicator();
                }
            });

            if (!hasStarted) {
                responseStarted = true;
                if (typingIndicatorTimer) {
                    clearTimeout(typingIndicatorTimer);
                    typingIndicatorTimer = null;
                }
                removeTypingIndicator();
            }

            const totalMs = Math.round(performance.now() - requestStart);
            console.log(`Streaming: ${totalChunks} eventos con texto en ${totalMs}ms`);
            scrollToBottom();
        } catch (err) {
            responseStarted = true;
            if (typingIndicatorTimer) {
                clearTimeout(typingIndicatorTimer);
                typingIndicatorTimer = null;
            }
            removeTypingIndicator();

            if (err && err.name === 'AbortError') {
                console.warn('Solicitud abortada');
                return;
            }

            if (botMessageEl) {
                botMessageEl.textContent = 'Ocurrió un error al recibir la respuesta.';
            } else {
                appendMessage('Ocurrió un error al recibir la respuesta.', 'bot');
            }

            console.error('Error enviando mensaje:', err);
        } finally {
            activeAbortController = null;
        }
    }

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isCooldownActive()) {
                return;
            }
            sendMessage();
        }
    });

    chatButton.addEventListener('click', () => {
        isOpen = !isOpen;
        chatContainer.classList.toggle('is-open', isOpen);
        if (isOpen && !memoryLoaded) {
            showSkeleton();
        }
    });

    document.body.appendChild(chatButton);
    document.body.appendChild(chatContainer);

    loadMemory().then(handleAutoMessageFromUrl);

    return chatButton;
}

createChatWidget();
