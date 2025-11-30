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
exports.ChatService = void 0;
const prisma_1 = require("../../../config/prisma");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const open_router_1 = require("../../helper/open-router");
const chatWithBot = (message, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!message || message.trim().length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Message cannot be empty');
    }
    if (message.length > 500) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Message is too long (max 500 characters)');
    }
    try {
        const recentChats = yield prisma_1.prisma.chat.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: { message: true, reply: true },
        });
        const conversationHistory = recentChats.reverse().flatMap((chat) => [
            { role: 'user', content: chat.message },
            { role: 'assistant', content: chat.reply },
        ]);
        const systemPrompt = `You are a helpful AI assistant for an e-commerce platform.

Your responsibilities:
- Help users with product recommendations and shopping queries
- Answer questions about orders, delivery, and returns
- Provide technical specifications and product comparisons
- Assist with FAQs and general customer support
- Be friendly, professional, and concise
- Answer in Bangla if the user asks in Bangla, otherwise in English
- Keep responses clear and under 150 words

Important: Focus on being helpful and accurate.`;
        const completion = yield open_router_1.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                ...conversationHistory,
                { role: 'user', content: message.trim() },
            ],
            temperature: 0.7,
            max_tokens: 350,
            top_p: 0.9,
        });
        const reply = ((_c = (_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) ||
            'Sorry, I could not process your request. Please try again.';
        yield prisma_1.prisma.chat.create({
            data: {
                userId,
                message: message.trim(),
                reply,
            },
        });
        return {
            reply: reply,
        };
    }
    catch (error) {
        console.error('❌ Chatbot error:', error);
        if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 429) {
            throw new AppError_1.default(http_status_1.default.TOO_MANY_REQUESTS, 'AI service is busy. Please try again in a moment.');
        }
        if (((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) === 401 || ((_f = error.response) === null || _f === void 0 ? void 0 : _f.status) === 403) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'AI service authentication failed.');
        }
        if (((_g = error.response) === null || _g === void 0 ? void 0 : _g.status) === 404) {
            throw new AppError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, 'AI model is currently unavailable. Please try again later.');
        }
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            throw new AppError_1.default(http_status_1.default.REQUEST_TIMEOUT, 'Request timeout. Please try again.');
        }
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Chatbot service error: ${error.message || 'Unknown error occurred'}`);
    }
});
const getChatHistory = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, limit = 20) {
    if (limit < 1 || limit > 100) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Limit must be between 1 and 100');
    }
    const chats = yield prisma_1.prisma.chat.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
            id: true,
            message: true,
            reply: true,
            createdAt: true,
        },
    });
    return {
        count: chats.length,
        chats: chats.map(chat => ({
            id: chat.id,
            message: chat.message,
            reply: chat.reply,
            timestamp: chat.createdAt,
        })),
    };
});
const clearChatHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.chat.deleteMany({
        where: { userId },
    });
    return {
        deletedCount: result.count,
        message: `Successfully deleted ${result.count} chat(s)`,
    };
});
exports.ChatService = {
    chatWithBot,
    getChatHistory,
    clearChatHistory,
};
