const socket = io();
let sessionId = null;
let user = `User${Math.floor(Math.random() * 1000)}`;

const createBtn    = document.getElementById('create-btn');
const joinBtn      = document.getElementById('join-btn');
const sessionInput = document.getElementById('session-input');
const inviteDiv    = document.getElementById('invite');
const inviteLink   = document.getElementById('invite-link');

const netflixInput = document.getElementById('netflix-link-input');
const loadVideoBtn = document.getElementById('load-video-btn');
const netflixPlayer= document.getElementById('netflix-player');

const messagesDiv  = document.getElementById('messages');
const chatInput    = document.getElementById('chat-input');
const sendBtn      = document.getElementById('send-btn');

// Sessão
createBtn.onclick = () => {
  sessionId = Math.random().toString(36).substr(2, 9);
  startSession();
};
joinBtn.onclick = () => {
  const id = sessionInput.value.trim();
  if (!id) return alert('Informe o código da sessão!');
  sessionId = id;
  startSession();
};
function startSession() {
  inviteDiv.hidden = false;
  const url = `${location.origin}${location.pathname}?session=${sessionId}`;
  inviteLink.href = url;
  inviteLink.textContent = url;

  socket.emit('join', { sessionId, user });
  socket.on('systemMessage', msg => appendMessage('Sistema', msg));
  socket.on('chatMessage', ({ user, text }) => appendMessage(user, text));
}

// Carregar vídeo Netflix
loadVideoBtn.onclick = () => {
  const url = netflixInput.value.trim();
  const m = url.match(/netflix\.com\/(watch\/\d+)/);
  if (!m) return alert('Link inválido! Use https://www.netflix.com/watch/XXXX');
  netflixPlayer.src = `/netflix/${m[1]}`;
};

// Chat
sendBtn.onclick = () => {
  const text = chatInput.value.trim();
  if (!text || !sessionId) return;
  socket.emit('chatMessage', { sessionId, user, text });
  chatInput.value = '';
};
function appendMessage(user, text) {
  const div = document.createElement('div');
  div.className = 'message';
  div.textContent = `${user}: ${text}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Auto‑join via URL
window.addEventListener('load', () => {
  const p = new URLSearchParams(location.search);
  if (p.has('session')) {
    sessionId = p.get('session');
    startSession();
  }
});
