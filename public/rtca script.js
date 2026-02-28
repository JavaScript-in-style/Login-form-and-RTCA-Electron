const socket = io();

const savedName = localStorage.getItem('chatUsername') || sessionStorage.getItem('chatUsername');
const username = document.querySelector('#name');
username.textContent = savedName;
if(!savedName) {
    window.location.href = '/';
}

const savedMail = localStorage.getItem('userMail') || sessionStorage.getItem('userMail');
const savedAvatar = localStorage.getItem('savedAvatar') || sessionStorage.getItem('savedAvatar');
const defaultAvatar = 'https://shorturl.at/XhBVh';
document.querySelector('.pfp').src = savedAvatar || defaultAvatar;
document.querySelector('#profileAvatar').src = savedAvatar || defaultAvatar;

// ─── Message rendering ────────────────────────
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

// ─── Settings panel ───────────────────────────
const settingsPanel = document.getElementById('settingsPanel');
const settingsOverlay = document.getElementById('settingsOverlay');
const settingsClose = document.getElementById('settingsClose');
const settingsBtn = document.querySelector('.settings-btn');

// Set profile name display
document.getElementById('profileNameDisplay').textContent = savedName;
document.getElementById('nicknameInput').placeholder = savedName;

// Open
settingsBtn.addEventListener('click', () => {
  settingsPanel.classList.add('open');
  settingsOverlay.classList.add('open');
});

// Close
function closeSettings() {
  settingsPanel.classList.remove('open');
  settingsOverlay.classList.remove('open');
}

settingsClose.addEventListener('click', closeSettings);
settingsOverlay.addEventListener('click', closeSettings);

// Nav switching
document.querySelectorAll('.settings-nav-item[data-section]').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
    item.classList.add('active');
    document.getElementById(`section-${item.dataset.section}`).classList.add('active');
  });
});

// Save nickname
document.getElementById('saveNickname').addEventListener('click', () => {
  const storageType = localStorage.getItem('storageType');
  const newName = document.getElementById('nicknameInput').value.trim();
  if(newName) {
    if(storageType === 'local') {localStorage.setItem('chatUsername', newName)}
    else {sessionStorage.setItem('chatUsername', newName)};
    document.getElementById('profileNameDisplay').textContent = newName;
    document.querySelector('#name').textContent = newName;
    document.getElementById('nicknameInput').placeholder = newName;
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('chatUsername');
  localStorage.removeItem('userMail');
  localStorage.removeItem('storageType');
  sessionStorage.removeItem('chatUsername');
  sessionStorage.removeItem('userMail');
  window.location.href = '/';
});

// Me making it function cuz i'm better than any ai

const avatarEdit = document.querySelector('.avatar-edit-btn');
const avatarSelector = document.querySelector('.avatarSelector');
const avatar = document.querySelector('#profileAvatar');
const mailShow = document.querySelectorAll('.settings-input')[1];
const changePass = document.querySelectorAll('.settings-save-btn')[1];

avatarEdit.addEventListener('click', () => {
  avatarSelector.click();
});

avatarSelector.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('name', savedName);

  const response = await fetch('/upload-avatar', {
    method: 'POST',
    body: formData
  });

  const newAvatar = await response.text();
  avatar.src = newAvatar;
  document.querySelector('.pfp').src = newAvatar;
  localStorage.setItem('savedAvatar', newAvatar);
});


mailShow.value = savedMail;

changePass.addEventListener('click', async () => {
  const newPass = document.querySelectorAll('.settings-input')[2].value.trim();
  if(newPass) {
    const response = await fetch('/change-pass', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ pass: newPass, name: savedName})
        });
  };
  document.getElementById('logoutBtn').click();
});

