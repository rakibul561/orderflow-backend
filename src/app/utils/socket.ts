import { Server } from "socket.io";
import { jwtHelper } from "../helper/jwtHelper";
import config from "../../config";


export let io: Server;

export function initializeSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    try {
      const decoded = jwtHelper.verifyToken(
        token as string,
        config.jwt.jwt_secret as string
      );

      socket.data.userId = decoded.id;
      socket.data.role = decoded.role;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    if (userId) {
      socket.join(userId);
      console.log(`✅ User ${userId} connected to Socket.io`);
    }

    socket.on("disconnect", () => {
      console.log(`❌ User ${userId} disconnected from Socket.io`);
    });
  });

  return io;
}