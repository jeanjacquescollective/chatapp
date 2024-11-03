// server/server.js
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer((req, res) => {
  // Handle HTTP requests if needed
});
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins
  },
});

io.on('connection', (socket) => {
  console.log('User connected');
  
  // Join a room
  socket.on('join room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Handle chat messages
  socket.on('chat message', ({ chatroomId, content, userId }) => {
    console.log(`Message: ${content} from user: ${userId} in room: ${chatroomId}`);
    io.to(chatroomId).emit('chat message', {userId, content}); // Broadcast the message to the specified room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});
