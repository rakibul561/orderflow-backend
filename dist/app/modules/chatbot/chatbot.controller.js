"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const chatbot_services_1 = require("./chatbot.services");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
exports.chatController = {
    chatWithBot: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { message } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
        }
        const result = yield chatbot_services_1.ChatService.chatWithBot(message, userId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Chatbot replied successfully',
            data: result,
        });
    })),
    getChatHistory: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const limit = Number(req.query.limit) || 20;
        if (!userId) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
        }
        const result = yield chatbot_services_1.ChatService.getChatHistory(userId, limit);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: 'Chat history retrieved successfully',
            data: result,
        });
    })),
    clearChatHistory: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
        }
        const result = yield chatbot_services_1.ChatService.clearChatHistory(userId);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: 'Chat history cleared successfully',
            data: result,
        });
    })),
};
