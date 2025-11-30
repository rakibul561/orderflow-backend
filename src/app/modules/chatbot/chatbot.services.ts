import { prisma } from '../../../config/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { openai } from '../../helper/open-router';

const chatWithBot = async (message: string, userId: string) => {
  if (!message || message.trim().length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Message cannot be empty');
  }

  if (message.length > 500) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Message is too long (max 500 characters)');
  }

  try {
   
    const recentChats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { message: true, reply: true },
    });

    const conversationHistory = recentChats.reverse().flatMap((chat) => [
      { role: 'user' as const, content: chat.message },
      { role: 'assistant' as const, content: chat.reply },
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

    
    const completion = await openai.chat.completions.create({
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

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      'Sorry, I could not process your request. Please try again.';

   
    await prisma.chat.create({
      data: {
        userId,
        message: message.trim(),
        reply,
      },
    });

 
    return {
      reply: reply,
    };
  } catch (error: any) {
    console.error('❌ Chatbot error:', error);

    if (error.response?.status === 429) {
      throw new AppError(
        httpStatus.TOO_MANY_REQUESTS,
        'AI service is busy. Please try again in a moment.'
      );
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'AI service authentication failed.'
      );
    }

    if (error.response?.status === 404) {
      throw new AppError(
        httpStatus.SERVICE_UNAVAILABLE,
        'AI model is currently unavailable. Please try again later.'
      );
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new AppError(
        httpStatus.REQUEST_TIMEOUT,
        'Request timeout. Please try again.'
      );
    }

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Chatbot service error: ${error.message || 'Unknown error occurred'}`
    );
  }
};

const getChatHistory = async (userId: string, limit: number = 20) => {
  if (limit < 1 || limit > 100) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Limit must be between 1 and 100');
  }

  const chats = await prisma.chat.findMany({
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
};

const clearChatHistory = async (userId: string) => {
  const result = await prisma.chat.deleteMany({
    where: { userId },
  });

  return {
    deletedCount: result.count,
    message: `Successfully deleted ${result.count} chat(s)`,
  };
};

export const ChatService = {
  chatWithBot,
  getChatHistory,
  clearChatHistory,
};