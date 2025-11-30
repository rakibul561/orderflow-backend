"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = exports.updateOrderStatusValidation = exports.createOrderValidation = exports.orderItemSchema = void 0;
// validation/order.validation.ts
const zod_1 = require("zod");
exports.orderItemSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Product title is required"),
    price: zod_1.z.number().positive("Price must be positive"),
    quantity: zod_1.z.number().int().positive("Quantity must be a positive integer"),
});
exports.createOrderValidation = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z
            .array(exports.orderItemSchema)
            .min(1, "At least one item is required"),
        paymentMethod: zod_1.z.enum(["STRIPE", "PAYPAL"]),
    }),
});
exports.updateOrderStatusValidation = zod_1.z.object({
    body: zod_1.z.object({
        orderStatus: zod_1.z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"]),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Order ID is required"),
    }),
});
exports.OrderValidation = {
    createOrderValidation: exports.createOrderValidation,
    updateOrderStatusValidation: exports.updateOrderStatusValidation,
};
