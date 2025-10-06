// Connect to your backend server
const socket = io("http://localhost:3000");

// Get DOM elements
const messageInput = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");
const typingDiv = document.getElementById("typing");
const sendBtn = document.getElementById("sendBtn");

// Ask for username
const username = prompt("Enter your name:");
const room = "General";

// Join the chat room
socket.emit("joinRoom", { username, room });

// Load old messages from the server
socket.on("loadMessages", (messages) => {
  messages.forEach((msg) => addMessage(msg.username, msg.message));
});

// When a new message is received from server
socket.on("message", (msg) => {
  addMessage(msg.username, msg.message);
});

// When someone is typing
socket.on("userTyping", (user) => {
  typingDiv.innerText = `${user} is typing...`;
  setTimeout(() => (typingDiv.innerText = ""), 2000);
});

// When user clicks send button
sendBtn.addEventListener("click", sendMessage);

// When user types
messageInput.addEventListener("keypress", () => {
  socket.emit("typing", { username, room });
});

// Function to send message
function sendMessage() {
  const message = messageInput.value.trim();

  if (message) {
    // ✅ Show instantly on screen
    addMessage(username, message);

    // ✅ Send to backend (so others see it too)
    socket.emit("chatMessage", { username, room, message });

    // Clear input box
    messageInput.value = "";
  }
}

// Function to add message in chat area
function addMessage(user, msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<b>${user}:</b> ${msg}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
