import express from 'express';
import { WebhookController } from './webhool.controller';


const router = express.Router();

// ⚠️ গুরুত্বপূর্ণ: Webhook routes এ raw body দরকার
// তাই এখানে express.json() ব্যবহার করবেন না

router.post(
    '/stripe',
    express.raw({ type: 'application/json' }),
    WebhookController.handleStripeWebhook
);

router.post(
    '/paypal',
    express.json(), // PayPal JSON body চায়
    WebhookController.handlePayPalWebhook
);

export const WebhookRoutes = router;