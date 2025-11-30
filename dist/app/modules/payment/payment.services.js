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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const stripe_1 = require("stripe");
const prisma_1 = require("../../../config/prisma");
const socket_1 = require("../../utils/socket");
const stripe = new stripe_1.Stripe(process.env.STRIPE_SECRET_KEY);
const handleStripeWebhookEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object;
            if (((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.orderId) && session.payment_status === "paid") {
                try {
                    const updatedOrder = yield prisma_1.prisma.order.update({
                        where: {
                            id: session.metadata.orderId
                        },
                        data: {
                            paymentStatus: "PAID",
                            orderStatus: "PROCESSING",
                            updatedAt: new Date(),
                        },
                    });
                    const userId = session.metadata.userId;
                    if (userId && socket_1.io) {
                        socket_1.io.to(userId).emit("orderUpdate", {
                            orderId: updatedOrder.id,
                            paymentStatus: updatedOrder.paymentStatus,
                            orderStatus: updatedOrder.orderStatus,
                            message: "Payment successful! Your order is being processed.",
                        });
                    }
                }
                catch (error) {
                    throw error;
                }
            }
            break;
        case "checkout.session.expired":
            if ((_b = event.data.object.metadata) === null || _b === void 0 ? void 0 : _b.orderId) {
                yield prisma_1.prisma.order.update({
                    where: { id: event.data.object.metadata.orderId },
                    data: {
                        paymentStatus: "FAILED",
                        orderStatus: "PENDING",
                    },
                });
            }
            break;
        case "payment_intent.payment_failed":
            break;
        default:
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
    return { received: true };
});
exports.PaymentService = {
    handleStripeWebhookEvent,
};
