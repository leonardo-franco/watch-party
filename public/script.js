const socket = io();
let sessionId = null;
let user = `User${Math.floor(Math.random() * 1000)}`;

document.getElementById('create-btn').onclick = () => {
  sessionId = Math.random().toString(36).substr(2, 9);
  startSession();
};

document.getElementById('join-btn').onclick = () => {
  const id = document.getElementById('session-input').value.trim();
  if (id) {
    sessionId = id;
    startSession();
  }
};

function startSession() {
  document.getElementById('invite').hidden = false;
  const url = `${location.origin}/?session=${sessionId}`;
  const inviteLink = document.getElementById('invite-link');
  inviteLink.href = url;
  inviteLink.textContent = url;

  socket.emit('join', { sessionId, user });
  socket.on('systemMessage', msg => appendMessage('Sistema', msg));
  socket.on('chatMessage', ({ user, text }) => appendMessage(user, text));
}

document.getElementById('send-btn').onclick = () => {
  const text = document.getElementById('chat-input').value.trim();
  if (!text) return;
  socket.emit('chatMessage', { sessionId, user, text });
  document.getElementById('chat-input').value = '';
};

function appendMessage(user, text) {
  const div = document.createElement('div');
  div.textContent = `${user}: ${text}`;
  document.getElementById('messages').appendChild(div);
}
