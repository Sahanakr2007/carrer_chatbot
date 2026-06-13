const SUGGESTIONS = [
  "I love computers & coding 💻",
  "I'm good at drawing & art 🎨",
  "I like helping people 🤝",
  "I enjoy science & experiments 🔬",
  "I'm interested in business 📈",
  "I don't know what to choose 😕",
];

let messages = [
  {
    role: "assistant",
    content: "🌟 Hello! I'm CareerCompass AI — your personal career guide.\n\nI'm here to help you discover a career path that truly fits YOU — your interests, strengths, and dreams.\n\nTell me a bit about yourself — what subjects or activities do you enjoy the most? ✨",
  },
];
let loading = false;
let showSuggestions = true;

const chatArea = document.getElementById("chatArea");
const chatEnd = document.getElementById("chatEnd");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");
const suggestionsEl = document.getElementById("suggestions");
const suggestionsGrid = document.getElementById("suggestionsGrid");

// Generate stars
(function () {
  const container = document.getElementById("stars");
  for (let i = 0; i < 40; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random() * 2 + 1;
    star.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px; height: ${size}px;
      opacity: ${Math.random() * 0.5 + 0.2};
      animation-duration: ${2 + Math.random() * 3}s;
      animation-delay: ${Math.random() * 3}s;
    `;
    container.appendChild(star);
  }
})();

// Build suggestions
SUGGESTIONS.forEach((text) => {
  const btn = document.createElement("button");
  btn.className = "suggestion-btn";
  btn.textContent = text;
  btn.addEventListener("click", () => sendMessage(text));
  suggestionsGrid.appendChild(btn);
});

function renderMessages() {
  document.querySelectorAll(".message-row").forEach((el) => el.remove());

  messages.forEach((msg) => {
    const row = document.createElement("div");
    row.className = `message-row ${msg.role}`;

    const avatar = document.createElement("div");
    avatar.className = `avatar ${msg.role === "assistant" ? "ai-avatar" : "user-avatar"}`;
    avatar.textContent = msg.role === "assistant" ? "🧭" : "👤";

    const bubble = document.createElement("div");
    bubble.className = `bubble ${msg.role === "assistant" ? "ai" : "user"}`;
    bubble.textContent = msg.content;

    row.appendChild(avatar);
    row.appendChild(bubble);
    chatArea.insertBefore(row, typingIndicator);
  });

  chatEnd.scrollIntoView({ behavior: "smooth" });
}

async function sendMessage(text) {
  const userText = text || userInput.value.trim();
  if (!userText || loading) return;

  userInput.value = "";
  updateSendBtn();

  if (showSuggestions) {
    showSuggestions = false;
    suggestionsEl.style.display = "none";
  }

  messages.push({ role: "user", content: userText });
  renderMessages();
  setLoading(true);

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json();
    messages.push({
      role: "assistant",
      content: data.error ? `⚠️ Error: ${data.error}` : data.reply,
    });
  } catch {
    messages.push({ role: "assistant", content: "⚠️ Connection error. Please try again!" });
  }

  setLoading(false);
  renderMessages();
}

function setLoading(state) {
  loading = state;
  typingIndicator.style.display = state ? "flex" : "none";
  updateSendBtn();
  if (state) chatEnd.scrollIntoView({ behavior: "smooth" });
}

function updateSendBtn() {
  sendBtn.disabled = loading || !userInput.value.trim();
}

userInput.addEventListener("input", updateSendBtn);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
sendBtn.addEventListener("click", () => sendMessage());

renderMessages();