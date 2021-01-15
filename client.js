const socket = io("http://localhost:8000");
const sendMessageForm = document.getElementById("sendMessageForm");
const messageInput = document.getElementById("messageInput");
const chatBox = document.querySelector(".chatBox");

function appendMessage(message, position) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("messageContainer");
  messageElement.classList.add(position);
  messageElement.innerHTML = message;
  chatBox.append(messageElement);
}

const userName = prompt("Enter your name");
socket.emit("new-user-joined", userName);

sendMessageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`, "rightMsg");
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

// This is welcome message sent by the server
socket.on("client-welcome-sent-from-server", (data) => {
  appendMessage(`Hey ${data}, Welcome to the conversation`, "centerMsg");

  console.log(`Welcome user ${data}: Sent by the server`);
});

// This is for message received
socket.on("received-message", (data) => {
  appendMessage(`${data.name}: ${data.message}`, "leftMsg");
});

// This is "joined the conversation" notification to all the clients when a new client is joined
socket.on("new-user-connected-notif-to-all-clients", (data) => {
  appendMessage(`${data} joined the coversation`, "centerMsg");
});

// When some client/user lefts the conversation
socket.on("user-disconnected", (name) => {
  appendMessage(`${name} left the conversation`, "centerMsg");
});
