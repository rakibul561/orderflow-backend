"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotRoutes = void 0;
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const chatbot_controller_1 = require("./chatbot.controller");
const express_1 = __importDefault(require("express"));
const ValidateRequest_1 = __importDefault(require("../../middlewares/ValidateRequest"));
const chatbot_validation_1 = require("./chatbot.validation");
const router = express_1.default.Router();
router.post('/chat', (0, auth_1.default)(client_1.Role.USER, client_1.Role.ADMIN), (0, ValidateRequest_1.default)(chatbot_validation_1.chatValidation.chatMessage), chatbot_controller_1.chatController.chatWithBot);
router.get('/my-history', (0, auth_1.default)(client_1.Role.USER, client_1.Role.ADMIN), chatbot_controller_1.chatController.getChatHistory);
router.delete('/clear', (0, auth_1.default)(client_1.Role.USER, client_1.Role.ADMIN), chatbot_controller_1.chatController.clearChatHistory);
exports.ChatbotRoutes = router;
