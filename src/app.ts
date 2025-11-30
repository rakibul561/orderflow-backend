import compression from "compression";
import cors from "cors";
import express, { Application } from "express";

import router from "./app/routes";

import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";


import { PaymentController } from "./app/modules/payment/payment.controller";

const app: Application = express();
app.use(cookieParser());
 
 
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(compression());

app.get("/", (req, res) => {
  console.log("✅ Root route HIT!");
  res.json({
    success: true,
    message: "Welcome to the OrderFlow Backend!",
  });
});






// ✅ JSON parser
app.use(express.json());

// ✅ API routes
app.use("/api/v1", router);

// ✅ 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

app.use(globalErrorHandler)

app.use(notFound)



export default app; 