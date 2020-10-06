const socket = io({
  transports: ['websocket']
});
const loginPage = document.querySelector('.login.page');
const chatPage =document.querySelector('.chat.page');
const usernameInput = document.querySelector('.usernameInput');
const chatArea_messages = document.querySelector('.messages');
const inputMessage = document.querySelector('.inputMessage');

const updateValue = ((e) => {
  if(e) {
    loginPage.classList.add('invisible');
    chatPage.classList.add('visible');}
    let username = e.target.value;
    socket.emit('add user', username);
    inputMessage.focus();
});

const sendMessage = ((e) => {
  let data = e.target.value;
  if(e) {
    console.log('ok');
    console.log('send_message:', data);
    socket.emit('send_message', data);
  }
  inputMessage.value = "";
});

const scrollTop = (() => {
  chatArea_messages.scrollTop = chatArea_messages.scrollHeight;
});

const addChat = ((data) => {
  const div = document.createElement('li');
  const name = document.createElement('span');
  name.textContent= data.username+">";
  name.classList.add('name');
  name.style.color = data.usercolor;
  div.appendChild(name);
  const chat = document.createElement('span');
  chat.textContent = data.message;
  div.appendChild(chat);
  chatArea_messages.appendChild(div);
  scrollTop();
});

const welcomeUser = ((data) => {
  const div = document.createElement('li');
  div.classList.add('system')
  const chat = document.createElement('span');
  chat.textContent= `${data}님께서 입장하셨습니다`;
  div.appendChild(chat);
  chatArea_messages.appendChild(div);
  scrollTop();
});

const goodbyUser = ((data) => {
  const div = document.createElement('li');
  div.classList.add('system')
  const chat = document.createElement('span');
  chat.textContent= `${data.username}님께서 퇴장하셨습니다`;
  div.appendChild(chat);
  chatArea_messages.appendChild(div);
  scrollTop();
});

usernameInput.addEventListener('change', updateValue);
inputMessage.addEventListener('change', sendMessage);


socket.on('new_message', (data) => {
  console.log('new_message:', data);
  console.log('usercolor:', data.usercolor);
  addChat(data);
});


socket.on('welcomeUser', (username) => {
  welcomeUser(username);
});

socket.on('user_left', (data) => {
  goodbyUser(data);
});

window.onload = function() {
  usernameInput.focus();
};