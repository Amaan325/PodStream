// socket.js
let io = null;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ New client connected");

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected");
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
