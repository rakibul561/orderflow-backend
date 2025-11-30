import { Stripe } from "stripe";
import { prisma } from "../../../config/prisma";
import { io } from "../../utils/socket";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  console.log("➡️ Received Stripe Event:", event.type);

  switch (event.type) {
    case "checkout.session.completed":
      console.log("✅ Checkout Session Completed");

      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata?.orderId && session.payment_status === "paid") {
        console.log("💰 Payment Status:", session.payment_status);
        console.log("🆔 Order ID:", session.metadata.orderId);

        try {
          const updatedOrder = await prisma.order.update({
            where: { 
              id: session.metadata.orderId 
            },
            data: {
              paymentStatus: "PAID",
              orderStatus: "PROCESSING",
              updatedAt: new Date(),
            },
          });

          console.log("✅ Order Updated Successfully:", updatedOrder);

          const userId = session.metadata.userId;
          if (userId && io) {
            console.log("📢 Emitting orderUpdate event to user:", userId);

            io.to(userId).emit("orderUpdate", {
              orderId: updatedOrder.id,
              paymentStatus: updatedOrder.paymentStatus,
              orderStatus: updatedOrder.orderStatus,
              message: "Payment successful! Your order is being processed.",
            });
          }
        } catch (error) {
          console.error("❌ Error updating order:", error);
          throw error;
        }
      }
      break;

    case "checkout.session.expired":
      console.log("⏳ Checkout Session Expired");

      if (event.data.object.metadata?.orderId) {
        await prisma.order.update({
          where: { id: event.data.object.metadata.orderId },
          data: { 
            paymentStatus: "FAILED",
            orderStatus: "PENDING",
          },
        });

        console.log("⚠️ Order marked as FAILED due to session expiry");
      }
      break;

    case "payment_intent.payment_failed":
      console.log("❌ Payment Intent Failed");
      break;

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return { received: true };
};

export const PaymentService = {
  handleStripeWebhookEvent,
};
