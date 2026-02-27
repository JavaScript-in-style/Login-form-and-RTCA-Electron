const socket = io();

const savedName = localStorage.getItem('chatUsername') || 'Anonymous';
const username = document.querySelector('#name');
username.textContent = savedName;

function createMessageEl(name, text) {
  const el = document.createElement('li');
  const initial = name ? name[0].toUpperCase() : '?';
  el.innerHTML = `
    <div class="msg-avatar">${initial}</div>
    <div class="msg-content">
      <span class="msg-name">${name || 'Anonymous'}</span>
      <span class="msg-text">${text || ''}</span>
    </div>
  `;
  return el;
}

socket.on('message', (data) => {
  const el = createMessageEl(data.name, data.text);
  document.querySelector('.list').appendChild(el);
  el.scrollIntoView({ behavior: 'smooth', block: 'end' });
});

socket.on('history', (messages) => {
  messages.forEach(message => {
    const el = createMessageEl(message.name, message.text);
    document.querySelector('.list').appendChild(el);
  });
  const list = document.querySelector('.list');
  list.scrollTop = list.scrollHeight;
});

const messageInput = document.querySelector('#message');

document.querySelector('.btn').onclick = () => {
  if(messageInput.value === '') return;
  const data = {
    name: savedName,
    text: messageInput.value
  };
  socket.emit('message', data);
  messageInput.value = '';
};

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.querySelector('.btn').click();
  }
});