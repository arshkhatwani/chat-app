const port = 8000;
const io = require("socket.io")(port);

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("new-user-connected-notif-to-all-clients", name);
    socket.emit("client-welcome-sent-from-server", name);
    console.log(`User{${name}} joined the conversation`);
  });

  socket.on("send-chat-message", (message) => {
    console.log(
      `Message: {${message}} revceived from client {${users[socket.id]}}`
    );
    console.log("Sending this message to all the other clients");
    socket.broadcast.emit("received-message", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    if (users[socket.id] != null) {
      socket.broadcast.emit("user-disconnected", users[socket.id]);
      console.log(`User{${users[socket.id]}} left the conversation`);
      delete users[socket.id];
    }
  });
});
