import compression from "compression";
import cors from "cors";
import express, { Application } from "express";
import config from "./config";
import router from "./app/routes";
import { WebhookRoutes } from "./app/modules/webhook/webhool.route";
import cookieParser from "cookie-parser";

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

// ✅ Webhook routes
app.use("/api/v1/webhooks", WebhookRoutes);

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

export default app; // ✅ app export, server na