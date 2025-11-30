import { Stripe } from "stripe";
import { prisma } from "../../../config/prisma";
import { io } from "../../utils/socket";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      
 

      if (session.metadata?.orderId && session.payment_status === "paid") {
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

       

          const userId = session.metadata.userId;
          if (userId && io) {
            io.to(userId).emit("orderUpdate", {
              orderId: updatedOrder.id,
              paymentStatus: updatedOrder.paymentStatus,
              orderStatus: updatedOrder.orderStatus,
              message: "Payment successful! Your order is being processed.",
            });
            console.log(`📡 Notification sent to user: ${userId}`); 
          }
        } catch (error) {
          console.error("❌ Error updating order:", error);
          throw error;
        }
      }
      break;

    case "checkout.session.expired":
      console.log("⚠️ Payment session expired!");
      
      if (event.data.object.metadata?.orderId) {
        await prisma.order.update({
          where: { id: event.data.object.metadata.orderId },
          data: { 
            paymentStatus: "FAILED",
            orderStatus: "PENDING", 
          },
        });
      }
      break;

    case "payment_intent.payment_failed":
      console.log("❌ Payment failed!");
      break;

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return { received: true };
};

export const PaymentService = {
  handleStripeWebhookEvent,
};