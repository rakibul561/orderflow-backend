"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatValidation = void 0;
const zod_1 = require("zod");
const chatMessage = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z
            .string({ message: 'Message must be a string' })
            .min(1, { message: 'Message cannot be empty' })
            .max(500, { message: 'Message is too long (max 500 characters)' })
            .trim(),
    }),
});
exports.chatValidation = {
    chatMessage,
};
