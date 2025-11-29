import http, { Server } from "http";
import express from "express";
import app from "./app"; // ✅ Now correctly imports app
import dotenv from "dotenv";
import { prisma } from "./config/prisma";
import { Server as SocketIOServer } from "socket.io";
import { jwtHelper } from "./app/helper/jwtHelper";
import config from "./config";

dotenv.config();

let server: Server | null = null;
let io: SocketIOServer | null = null;

async function connectDb() {
  try {
    await prisma.$connect();
    console.log("*** database connected successfully!!");
  } catch (error) {
    console.log("*** Db connection failed!!");
    process.exit(1);
  }
}

async function startServer() {
  try {
    await connectDb();

    // ✅ HTTP server create
    server = http.createServer(app);

    // ✅ Socket.io setup
    io = new SocketIOServer(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });

    // ✅ Socket.io authentication
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

    // ✅ Socket.io connection
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

    // ✅ Server listen
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });

    handleProcessEvents();
  } catch (error) {
    console.error("❌ Error during server startup:", error);
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string) {
  console.warn(`🔄 Received ${signal}, shutting down gracefully...`);

  if (io) {
    io.close(() => {
      console.log("✅ Socket.io closed.");
    });
  }

  if (server) {
    server.close(async () => {
      console.log("✅ HTTP server closed.");

      try {
        await prisma.$disconnect();
        console.log("✅ Database disconnected.");
        console.log("Server shutdown complete.");
      } catch (error) {
        console.error("❌ Error during shutdown:", error);
      }

      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

function handleProcessEvents() {
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  process.on("uncaughtException", (error) => {
    console.error("💥 Uncaught Exception:", error);
    gracefulShutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.error("💥 Unhandled Rejection:", reason);
    gracefulShutdown("unhandledRejection");
  });
}

// Export io for use in other files
export { io };

// Start the application
startServer();