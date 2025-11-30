import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


const handleStripeWebhookEvent = async (event: Stripe.Event) => {
 

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("💰 Payment successful for session:", session);

      // Test এর জন্য শুধু console.log করবো
      console.log("🧾 Order ID:", session.metadata?.orderId);
      console.log("👤 User ID:", session.metadata?.userId);
      console.log("💳 Amount Paid:", session.amount_total);
      console.log("✅ Payment Status:", session.payment_status);

  

      break;

    case "checkout.session.expired":
      console.log("⚠️ Payment session expired!");
      break;

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return { received: true };
};

export const PaymentService = {
  handleStripeWebhookEvent,
};
