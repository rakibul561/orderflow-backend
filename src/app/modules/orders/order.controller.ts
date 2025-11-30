import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { OrderService } from './order.services';

const createOrder = catchAsync(async (req: Request, res: Response) => {


    const result = await OrderService.createOrder(req.body, (req.user as any));
    
   
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Order created successfully!',
        data: result,
    });
});

const getUserOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.getUserOrders(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Orders retrieved successfully!',
        data: result,
    });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.getOrderById(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order retrieved successfully!',
        data: result,
    });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.updateOrderStatus(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order status updated successfully!',
        data: result,
    });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.getAllOrders(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All orders retrieved successfully!',
        data: result.orders,
        meta: result.pagination,
    });
});

export const OrderController = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
};
