import compression from "compression";
import cors from "cors";
import express, { Application } from "express";
import config from "./config";
import router from "./app/routes";

import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

import bodyParser from 'body-parser';
import { PaymentController } from "./app/modules/payment/payment.controller";

const app: Application = express();
app.use(cookieParser());

// ✅ CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ✅ Compression
app.use(compression());

// ✅ Root route (JSON parser er AAGE)
app.get("/", (req, res) => {
  console.log("✅ Root route HIT!");
  res.json({
    success: true,
    message: "Welcome to the OrderFlow Backend!",
  });
});




app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (req, res, next) => {
        console.log("🔥 WEBHOOK ROUTE HIT!");
        console.log("Headers:", req.headers);
        next();
    },
    PaymentController.handleStripeWebhookEvent
);

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