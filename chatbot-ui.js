// Build and inject the chat widget into the page
function initChatbot() {
  // ── Widget HTML ──────────────────────────────────────────
  const widget = document.createElement("div");
  widget.id = "cb-widget";
  widget.innerHTML = `
    <button id="cb-toggle" aria-label="Open chat">💬</button>
    <div id="cb-box" style="display:none;">
      <div id="cb-header">
        <span>Chat with us</span>
        <button id="cb-close" aria-label="Close chat">✕</button>
      </div>
      <div id="cb-messages"></div>
      <div id="cb-input-row">
        <input id="cb-input" type="text" placeholder="Type a message…" />
        <button id="cb-send">Send</button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // ── Inject styles ────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #cb-widget { position:fixed; bottom:24px; right:24px; z-index:9999; font-family:sans-serif; }
    #cb-toggle { background:#1a6b5a; color:#f8f7f4; border:none; border-radius:50%; width:52px; height:52px; font-size:22px; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,.2); }
    #cb-box { width:320px; background:#f8f7f4; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,.15); display:flex; flex-direction:column; overflow:hidden; margin-bottom:8px; }
    #cb-header { background:#1a6b5a; color:#fff; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; font-weight:600; }
    #cb-close { background:none; border:none; color:#fff; font-size:18px; cursor:pointer; line-height:1; }
    #cb-messages { padding:12px; height:280px; overflow-y:auto; display:flex; flex-direction:column; gap:8px; }
    .cb-msg { max-width:80%; padding:8px 12px; border-radius:12px; font-size:14px; line-height:1.45; word-break:break-word; }
    .cb-msg.user { background:#1a6b5a; color:#fff; align-self:flex-end; border-bottom-right-radius:3px; }
    .cb-msg.bot  { background:#f1f1f1; color:#222; align-self:flex-start; border-bottom-left-radius:3px; }
    .cb-msg.bot.typing { color:#999; font-style:italic; }
    #cb-input-row { display:flex; padding:10px 12px; border-top:1px solid #eee; gap:8px; }
    #cb-input { flex:1; border:1px solid #ddd; border-radius:8px; padding:8px 10px; font-size:14px; outline:none; }
    #cb-input:focus { border-color:#1a6b5a; }
    #cb-send { background:#1a6b5a; color:#fff; border:none; border-radius:8px; padding:8px 14px; cursor:pointer; font-size:14px; }
    #cb-send:hover { background:#16b594; }
  `;
  document.head.appendChild(style);

  // ── Logic ────────────────────────────────────────────────
  const toggle   = document.getElementById("cb-toggle");
  const box      = document.getElementById("cb-box");
  const closeBtn = document.getElementById("cb-close");
  const messages = document.getElementById("cb-messages");
  const input    = document.getElementById("cb-input");
  const sendBtn  = document.getElementById("cb-send");

  toggle.addEventListener("click", () => {
    const isHidden = box.style.display === "none";
    box.style.display = isHidden ? "flex" : "none";
    if (isHidden && messages.children.length === 0) {
      appendMessage("bot", "Hi! 👋 How can I help you today?");
    }
  });

  closeBtn.addEventListener("click", () => { box.style.display = "none"; });

  function appendMessage(role, text, isTyping = false) {
    const div = document.createElement("div");
    div.className = `cb-msg ${role}${isTyping ? " typing" : ""}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  async function onSend() {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    sendBtn.disabled = true;

    appendMessage("user", text);
    const typingDiv = appendMessage("bot", "Typing…", true);

    try {
      const reply = await handleMessage(text);
      typingDiv.textContent = reply;
      typingDiv.classList.remove("typing");
    } catch (err) {
      typingDiv.textContent = "Sorry, something went wrong. Please try again.";
      typingDiv.classList.remove("typing");
    }

    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener("click", onSend);
  input.addEventListener("keydown", e => e.key === "Enter" && onSend());
}

// Auto-start when page is ready
document.addEventListener("DOMContentLoaded", initChatbot);