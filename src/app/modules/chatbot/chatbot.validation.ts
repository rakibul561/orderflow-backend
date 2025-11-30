import { z } from 'zod';

const chatMessage = z.object({
  body: z.object({
    message: z
      .string({ message: 'Message must be a string' })
      .min(1, { message: 'Message cannot be empty' })
      .max(500, { message: 'Message is too long (max 500 characters)' })
      .trim(),
  }),
});

export const chatValidation = {
  chatMessage,
};