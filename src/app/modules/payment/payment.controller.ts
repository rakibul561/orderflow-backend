import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";

import sendResponse from "../../shared/sendResponse";
import { stripe } from "../../helper/stripe";
import { PaymentService } from "./payment.services";
import config from "../../../config";



const handleStripeWebhookEvent = catchAsync(async (req: Request, res: Response) => {
    console.log("🎯 Controller reached!"); // Add this
    
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = config.webhook_secret as string;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        console.log("✅ Event verified:", event.type); // Add this
    } catch (err: any) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    const result = await PaymentService.handleStripeWebhookEvent(event);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Webhook req send successfully',
        data: result,
    });
});

export const PaymentController = {
    handleStripeWebhookEvent
}