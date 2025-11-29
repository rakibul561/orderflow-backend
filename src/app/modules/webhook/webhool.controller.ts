import { Request, Response } from 'express';
import Stripe from 'stripe';

import httpStatus from 'http-status';
import { PaymentService } from '../payment/payment.services';
import { OrderService } from '../orders/order.services';
const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;

    if (!sig) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: 'No stripe signature found',
        });
    }

    try {
        // Webhook verify করা
        const event = PaymentService.verifyStripeWebhook(req.body, sig);

        // Event type অনুযায়ী কাজ করা
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const { orderId, userId } = paymentIntent.metadata;

                if (orderId && userId) {
                    await OrderService.handleStripePaymentSuccess(orderId, userId);
                    console.log(`✅ Payment successful for order: ${orderId}`);
                }
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const { orderId, userId } = paymentIntent.metadata;

                if (orderId && userId) {
                    await OrderService.handlePaymentFailure(orderId, userId);
                    console.log(`❌ Payment failed for order: ${orderId}`);
                }
                break;
            }

            case 'payment_intent.canceled': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const { orderId, userId } = paymentIntent.metadata;

                if (orderId && userId) {
                    await OrderService.handlePaymentFailure(orderId, userId);
                    console.log(`🚫 Payment canceled for order: ${orderId}`);
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        // Stripe কে success response পাঠানো
        res.status(httpStatus.OK).json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error.message);
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
};

// PayPal Webhook Handler (Placeholder)
const handlePayPalWebhook = async (req: Request, res: Response) => {
    try {
        const { event_type, resource } = req.body;

        switch (event_type) {
            case 'PAYMENT.CAPTURE.COMPLETED': {
                // PayPal payment success
                const orderId = resource.purchase_units[0].reference_id;
                // Handle payment success
                console.log(`✅ PayPal payment successful for order: ${orderId}`);
                break;
            }

            case 'PAYMENT.CAPTURE.DENIED': {
                // PayPal payment failed
                const orderId = resource.purchase_units[0].reference_id;
                console.log(`❌ PayPal payment failed for order: ${orderId}`);
                break;
            }

            default:
                console.log(`Unhandled PayPal event: ${event_type}`);
        }

        res.status(httpStatus.OK).json({ received: true });
    } catch (error: any) {
        console.error('PayPal webhook error:', error.message);
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
};

export const WebhookController = {
    handleStripeWebhook,
    handlePayPalWebhook,
};