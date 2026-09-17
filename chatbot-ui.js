// ============================================================
// CHATBOT UI
// ============================================================

function initChatbot() {
  if (document.getElementById("cb-widget")) {
    return;
  }

  // ============================================================
  // WIDGET HTML
  // ============================================================

  const widget = document.createElement("div");

  widget.id = "cb-widget";

  widget.innerHTML = `
    <button
      id="cb-toggle"
      type="button"
      aria-label="Open chat"
      aria-expanded="false"
      aria-controls="cb-box"
    >
      💬
    </button>

    <div
      id="cb-box"
      role="dialog"
      aria-label="Chat with us"
      aria-hidden="true"
    >
      <div id="cb-header">
        <span id="cb-title">Chat with us</span>

        <button
          id="cb-close"
          type="button"
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      <div
        id="cb-messages"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      ></div>

      <div id="cb-input-row">
        <input
          id="cb-input"
          type="text"
          placeholder="Type a message…"
          autocomplete="off"
          aria-label="Type your message"
        />

        <button
          id="cb-send"
          type="button"
        >
          Send
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(widget);

  // ============================================================
  // STYLES
  // ============================================================

  const style = document.createElement("style");

  style.textContent = `
    #cb-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Arial,
        sans-serif;
    }

    #cb-toggle {
      width: 56px;
      height: 56px;

      display: flex;
      align-items: center;
      justify-content: center;

      border: none;
      border-radius: 50%;

      background: #1a6b5a;
      color: #ffffff;

      font-size: 23px;

      cursor: pointer;

      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

      transition:
        transform 0.2s ease,
        background 0.2s ease;
    }

    #cb-toggle:hover {
      background: #16b594;
      transform: scale(1.05);
    }

    #cb-toggle:active {
      transform: scale(0.95);
    }

    #cb-box {
      width: 340px;
      max-width: calc(100vw - 32px);

      background: #f8f7f4;

      border-radius: 16px;

      overflow: hidden;

      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);

      display: none;
      flex-direction: column;

      margin-bottom: 10px;
    }

    #cb-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      padding: 14px 16px;

      background: #1a6b5a;
      color: #ffffff;
    }

    #cb-title {
      font-size: 15px;
      font-weight: 600;
    }

    #cb-close {
      width: 30px;
      height: 30px;

      display: flex;
      align-items: center;
      justify-content: center;

      padding: 0;

      border: none;
      border-radius: 6px;

      background: transparent;
      color: #ffffff;

      font-size: 18px;
      line-height: 1;

      cursor: pointer;
    }

    #cb-close:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    #cb-messages {
      height: 300px;

      padding: 14px;

      overflow-y: auto;

      display: flex;
      flex-direction: column;

      gap: 8px;

      background: #ffffff;

      scroll-behavior: smooth;
    }

    .cb-msg {
      max-width: 82%;

      padding: 9px 12px;

      border-radius: 12px;

      font-size: 14px;
      line-height: 1.5;

      word-break: break-word;
      overflow-wrap: anywhere;
    }

    .cb-msg.user {
      align-self: flex-end;

      background: #1a6b5a;
      color: #ffffff;

      border-bottom-right-radius: 3px;
    }

    .cb-msg.bot {
      align-self: flex-start;

      background: #f1f1f1;
      color: #222222;

      border-bottom-left-radius: 3px;
    }

    .cb-msg.bot.typing {
      color: #888888;
      font-style: italic;
    }

    #cb-input-row {
      display: flex;
      align-items: center;

      gap: 8px;

      padding: 10px 12px;

      border-top: 1px solid #eeeeee;

      background: #f8f7f4;
    }

    #cb-input {
      flex: 1;
      min-width: 0;

      height: 38px;

      padding: 8px 10px;

      border: 1px solid #dddddd;
      border-radius: 8px;

      outline: none;

      background: #ffffff;
      color: #222222;

      font-size: 14px;

      box-sizing: border-box;
    }

    #cb-input::placeholder {
      color: #999999;
    }

    #cb-input:focus {
      border-color: #1a6b5a;
    }

    #cb-send {
      height: 38px;

      padding: 0 14px;

      border: none;
      border-radius: 8px;

      background: #1a6b5a;
      color: #ffffff;

      font-size: 14px;

      cursor: pointer;

      transition:
        background 0.2s ease,
        opacity 0.2s ease;
    }

    #cb-send:hover:not(:disabled) {
      background: #16b594;
    }

    #cb-send:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    #cb-messages::-webkit-scrollbar {
      width: 6px;
    }

    #cb-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    #cb-messages::-webkit-scrollbar-thumb {
      background: #cccccc;
      border-radius: 10px;
    }

    #cb-messages::-webkit-scrollbar-thumb:hover {
      background: #aaaaaa;
    }

    #cb-toggle:focus-visible,
    #cb-close:focus-visible,
    #cb-send:focus-visible,
    #cb-input:focus-visible {
      outline: 2px solid #16b594;
      outline-offset: 2px;
    }

    @media (max-width: 480px) {
      #cb-widget {
        left: 16px;
        right: 16px;
        bottom: 16px;
      }

      #cb-toggle {
        margin-left: auto;
      }

      #cb-box {
        width: 100%;
        max-width: none;
      }

      #cb-messages {
        height: 300px;
      }
    }
  `;

  document.head.appendChild(style);

  // ============================================================
  // ELEMENTS
  // ============================================================

  const toggle = document.getElementById("cb-toggle");
  const box = document.getElementById("cb-box");
  const closeBtn = document.getElementById("cb-close");
  const messages = document.getElementById("cb-messages");
  const input = document.getElementById("cb-input");
  const sendBtn = document.getElementById("cb-send");

  // ============================================================
  // APPEND MESSAGE
  // ============================================================

  function appendMessage(role, text, isTyping = false) {
    const message = document.createElement("div");

    message.className =
      `cb-msg ${role}${isTyping ? " typing" : ""}`;

    message.textContent = String(text);

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;

    return message;
  }

  // ============================================================
  // OPEN CHAT
  // ============================================================

  function openChat() {
    box.style.display = "flex";

    toggle.setAttribute("aria-expanded", "true");
    box.setAttribute("aria-hidden", "false");

    if (messages.children.length === 0) {
      appendMessage(
        "bot",
        "Hi! 👋 How can I help you today?"
      );
    }

    input.focus();
  }

  // ============================================================
  // CLOSE CHAT
  // ============================================================

  function closeChat() {
    box.style.display = "none";

    toggle.setAttribute("aria-expanded", "false");
    box.setAttribute("aria-hidden", "true");

    toggle.focus();
  }

  // ============================================================
  // TOGGLE
  // ============================================================

  toggle.addEventListener("click", () => {
    const isOpen = box.style.display === "flex";

    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  });

  // ============================================================
  // CLOSE BUTTON
  // ============================================================

  closeBtn.addEventListener("click", closeChat);

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  async function onSend() {
    if (sendBtn.disabled) {
      return;
    }

    const text = input.value.trim();

    if (!text) {
      return;
    }

    input.value = "";

    sendBtn.disabled = true;
    sendBtn.textContent = "…";

    appendMessage("user", text);

    const typingDiv = appendMessage(
      "bot",
      "Typing…",
      true
    );

    try {
      // handleMessage() comes from chatbot-engine.js
      if (typeof handleMessage !== "function") {
        throw new Error(
          "handleMessage() is not available. Make sure chatbot-engine.js is loaded before chatbot-ui.js."
        );
      }

      const reply = await handleMessage(text);

      if (
        reply === undefined ||
        reply === null ||
        String(reply).trim() === ""
      ) {
        throw new Error(
          "Chatbot returned an empty response."
        );
      }

      typingDiv.textContent = String(reply);
      typingDiv.classList.remove("typing");

      messages.scrollTop = messages.scrollHeight;

    } catch (error) {
      console.error("Chatbot error:", error);

      typingDiv.textContent =
        "Sorry, something went wrong. Please try again.";

      typingDiv.classList.remove("typing");

    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send";

      input.focus();
    }
  }

  // ============================================================
  // SEND BUTTON
  // ============================================================

  sendBtn.addEventListener("click", onSend);

  // ============================================================
  // ENTER KEY
  // ============================================================

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSend();
    }
  });

  // ============================================================
  // ESCAPE KEY
  // ============================================================

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      box.style.display === "flex"
    ) {
      closeChat();
    }
  });
}


// ============================================================
// INITIALIZE
// ============================================================

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initChatbot
  );
} else {
  initChatbot();
}
