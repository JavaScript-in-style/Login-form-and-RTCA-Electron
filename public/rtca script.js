const socket = io();

const savedName = localStorage.getItem('chatUsername') || 'Anonymous';
const username = document.querySelector('#name');
username.textContent = savedName;

socket.on('message', (data) => {
  const el = document.createElement('li');
  el.textContent = `${data.name}: ${data.text}`;
  document.querySelector('.list').appendChild(el);
  el.scrollIntoView({ behavior: 'smooth', block: 'end' });
});


const messageInput = document.querySelector('#message');

document.querySelector('.btn').onclick = () => {

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