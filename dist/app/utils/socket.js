"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
exports.initializeSocket = initializeSocket;
const socket_io_1 = require("socket.io");
const jwtHelper_1 = require("../helper/jwtHelper");
const config_1 = __importDefault(require("../../config"));
function initializeSocket(server) {
    exports.io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        },
    });
    exports.io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        if (!token) {
            return next(new Error("Authentication error: Token missing"));
        }
        try {
            const decoded = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.jwt_secret);
            socket.data.userId = decoded.id;
            socket.data.role = decoded.role;
            next();
        }
        catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
    });
    exports.io.on("connection", (socket) => {
        const userId = socket.data.userId;
        if (userId) {
            socket.join(userId);
            console.log(`✅ User ${userId} connected to Socket.io`);
        }
        socket.on("disconnect", () => {
            console.log(`❌ User ${userId} disconnected from Socket.io`);
        });
    });
    return exports.io;
}
