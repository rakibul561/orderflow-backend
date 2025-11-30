import { Request } from 'express';
import { IUpdateOrderStatusRequest, ICreateOrderRequest } from './order.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { prisma } from '../../../config/prisma';
import { PaymentService } from '../payment/payment.services';
import { io } from '../../utils/socket';

import config from '../../../config';
import { stripe } from '../../helper/stripe';


interface IAuthUser {
    id: string;
    role: string;
}




const createOrder = async (
    orderData: ICreateOrderRequest,
    user: IAuthUser | undefined
) => {
    const { items, paymentMethod } = orderData;
    const userId = user?.id;

    if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }


    const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (totalAmount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Total amount must be greater than 0');
    }


    const order = await prisma.order.create({
        data: {
            userId,
            items: items as any,
            totalAmount,
            paymentMethod,
            paymentStatus: 'PENDING',
            orderStatus: 'PENDING',
        },
    });



    let paymentData = null;
    if (paymentMethod === 'STRIPE') {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            const userEmail = user?.email;

                            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: [
                    {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                        name: `Customer ${userEmail}`,
                        },
                        unit_amount: Math.round(totalAmount * 100),
                    },
                    quantity: 1,
                    },
                ],
                metadata: {
                    orderId: order.id?.toString(), 
                    userId: userId?.toString(),    
                },
                success_url: `${config.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${config.frontendUrl}/payment/cancel`,
                });
                

                console.log("📦 Metadata sent:", session.metadata); 
                paymentData = {
                paymentUrl: session.url,
               sessionId: session.id,
};

        } catch (error: any) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                `Stripe payment failed: ${error.message}`
            );
        }
    }

    
    return {
        order,
        payment: paymentData,
    };
};









const getUserOrders = async (req: Request) => {
    const userId = req.user?.id;

    if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    return orders;
};

const getOrderById = async (req: Request) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const order = await prisma.order.findUnique({
        where: { id },
    });

    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    }

    if (order.userId !== userId && req.user?.role !== 'admin') {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied');
    }

    return order;
};

const updateOrderStatus = async (req: Request) => {
    const { id } = req.params;
    const { orderStatus } = req.body as IUpdateOrderStatusRequest;

    const order = await prisma.order.findUnique({
        where: { id },
    });

    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    }

    const updatedOrder = await prisma.order.update({
        where: { id },
        data: { orderStatus },
    });

    io.to(order.userId).emit('orderUpdate', {
        orderId: order.id,
        orderStatus,
        message: `আপনার order এর status "${orderStatus}" তে পরিবর্তিত হয়েছে`,
    });

    return updatedOrder;
};

const handleStripePaymentSuccess = async (
    orderId: string,
    userId: string
) => {
    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
            paymentStatus: 'PAID',
            orderStatus: 'PROCESSING',
        },
    });

    io.to(userId).emit('orderUpdate', {
        orderId,
        paymentStatus: 'PAID',
        orderStatus: 'PROCESSING',
        message: 'payment successful. Your order is now processing.',
    });

    return updatedOrder;
};

const handlePaymentFailure = async (orderId: string, userId: string) => {
    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
            paymentStatus: 'FAILED',
        },
    });

    io.to(userId).emit('orderUpdate', {
        orderId,
        paymentStatus: 'FAILED',
        message: 'payment failed or canceled.',
    });

    return updatedOrder;
};

const getAllOrders = async (req: Request) => {
    const { page = 1, limit = 10, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereClause: any = {};
    if (status) {
        whereClause.orderStatus = status;
    }

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where: whereClause,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }),
        prisma.order.count({ where: whereClause }),
    ]);

    return {
        orders,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};

export const OrderService = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    handleStripePaymentSuccess,
    handlePaymentFailure,
    getAllOrders,
};