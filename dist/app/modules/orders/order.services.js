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
exports.OrderService = exports.updateOrderStatus = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../../config/prisma");
const socket_1 = require("../../utils/socket");
const config_1 = __importDefault(require("../../../config"));
const stripe_1 = require("../../helper/stripe");
const createOrder = (orderData, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { items, paymentMethod } = orderData;
    const userId = user === null || user === void 0 ? void 0 : user.id;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (totalAmount <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Total amount must be greater than 0');
    }
    const order = yield prisma_1.prisma.order.create({
        data: {
            userId,
            items: items,
            totalAmount,
            paymentMethod,
            paymentStatus: 'PENDING',
            orderStatus: 'PENDING',
        },
    });
    let paymentData = null;
    if (paymentMethod === 'STRIPE') {
        try {
            const user = yield prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            const userEmail = user === null || user === void 0 ? void 0 : user.email;
            const session = yield stripe_1.stripe.checkout.sessions.create({
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
                    orderId: (_a = order.id) === null || _a === void 0 ? void 0 : _a.toString(),
                    userId: userId === null || userId === void 0 ? void 0 : userId.toString(),
                },
                success_url: `${config_1.default.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${config_1.default.frontendUrl}/payment/cancel`,
            });
            paymentData = {
                paymentUrl: session.url,
                sessionId: session.id,
            };
        }
        catch (error) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Stripe payment failed: ${error.message}`);
        }
    }
    return {
        order,
        payment: paymentData,
    };
});
const getUserOrders = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    const orders = yield prisma_1.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
    return orders;
});
const updateOrderStatus = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, orderStatus }) {
    const order = yield prisma_1.prisma.order.findUnique({
        where: { id },
    });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    const updatedOrder = yield prisma_1.prisma.order.update({
        where: { id },
        data: { orderStatus },
    });
    socket_1.io.to(order.userId).emit("orderUpdate", {
        orderId: order.id,
        orderStatus,
        message: `Order status updated to "${orderStatus}" by admin.`,
    });
    return updatedOrder;
});
exports.updateOrderStatus = updateOrderStatus;
const getAllOrders = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const whereClause = {};
    if (status) {
        whereClause.orderStatus = status;
    }
    const [orders, total] = yield Promise.all([
        prisma_1.prisma.order.findMany({
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
        prisma_1.prisma.order.count({ where: whereClause }),
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
});
exports.OrderService = {
    createOrder,
    getUserOrders,
    updateOrderStatus: exports.updateOrderStatus,
    getAllOrders,
};
