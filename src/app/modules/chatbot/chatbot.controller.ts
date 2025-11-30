import { Request, Response } from 'express';
import { ChatService } from './chatbot.services';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';


export const chatController = {
  chatWithBot: catchAsync(async (req: Request, res: Response) => {
    const { message } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const result = await ChatService.chatWithBot(message, userId);
    
       sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Chatbot replied successfully',
        data: result,
    });

  }),

  getChatHistory: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const limit = Number(req.query.limit) || 20;

    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const result = await ChatService.getChatHistory(userId, limit);
    
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Chat history retrieved successfully',
      data: result,
    });
  }),

  clearChatHistory: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const result = await ChatService.clearChatHistory(userId);
    
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Chat history cleared successfully',
      data: result,
    });
  }),
};