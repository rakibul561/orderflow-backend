
import Stripe from 'stripe';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import config from '../../../config';
import { prisma } from '../../../config/prisma';

const stripe = new Stripe(config.stripe_secret_key as string, {
   
});



const createStripePaymentIntent = async (
    orderId: string,
    amount: number,
    userId: string
) => {
    try {


         const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        const userEmail = user?.email 
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Customer ${userEmail}`,
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                orderId,
                userId,
            },
            success_url: `${config.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.frontendUrl}/payment/cancel`,
        });
        return {
            paymentUrl: session.url,
            sessionId: session.id,
        };
    } catch (error: any) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Stripe payment failed: ${error.message}`
        );
    }
};





// PayPal payment order তৈরি করা
const createPayPalOrder = async (
    orderId: string,
    amount: number,
    userId: string
) => {
    try {
        // PayPal SDK integration এখানে হবে
        // এটা একটা placeholder - আপনি paypal-rest-sdk ব্যবহার করতে পারেন
        
        const paypalOrderData = {
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: orderId,
                amount: {
                    currency_code: 'USD',
                    value: amount.toFixed(2),
                },
            }],
            application_context: {
                return_url: `${config.frontendUrl}/payment/success`,
                cancel_url: `${config.frontendUrl}/payment/cancel`,
            },
        };

        // PayPal API call করুন এখানে
        // const response = await paypalClient.orders.create(paypalOrderData);
        
        return {
            approvalUrl: 'https://paypal.com/checkout/...',
            paypalOrderId: 'PAYPAL_ORDER_ID',
        };
    } catch (error: any) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `PayPal payment failed: ${error.message}`
        );
    }
};

// Stripe webhook verify করা
const verifyStripeWebhook = (
    payload: string | Buffer,
    signature: string
): Stripe.Event => {
    try {
        return stripe.webhooks.constructEvent(
            payload,
            signature,
            config.webhook_secret as string
        );
    } catch (error: any) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Webhook signature verification failed: ${error.message}`
        );
    }
};

export const PaymentService = {
    createStripePaymentIntent,
    createPayPalOrder,
    verifyStripeWebhook,
};