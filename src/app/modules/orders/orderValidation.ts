// validation/order.validation.ts
import { z } from "zod";


export const orderItemSchema = z.object({
  title: z.string().min(1, "Product title is required"),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

export const createOrderValidation = z.object({
  body: z.object({
    items: z
      .array(orderItemSchema)
      .min(1, "At least one item is required"),

    paymentMethod: z.enum(["STRIPE", "PAYPAL"]),
  }),
});

export const updateOrderStatusValidation = z.object({
  body: z.object({
   
    orderStatus: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"]),
  }),
  params: z.object({
    id: z.string().min(1, "Order ID is required"),
  }),
});

export const OrderValidation = {
  createOrderValidation,
  updateOrderStatusValidation,
};
