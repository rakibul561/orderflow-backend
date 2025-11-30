"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const payment_controller_1 = require("./app/modules/payment/payment.controller");
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.post("/webhook", express_1.default.raw({ type: "application/json" }), payment_controller_1.PaymentController.handleStripeWebhookEvent);
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use((0, compression_1.default)());
app.get("/", (req, res) => {
    console.log("✅ Root route HIT!");
    res.json({
        success: true,
        message: "Welcome to the OrderFlow Backend!",
    });
});
// ✅ JSON parser
app.use(express_1.default.json());
// ✅ API routes
app.use("/api/v1", routes_1.default);
// ✅ 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
