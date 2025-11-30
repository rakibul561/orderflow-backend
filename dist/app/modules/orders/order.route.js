"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const orderValidation_1 = require("./orderValidation");
const ValidateRequest_1 = __importDefault(require("../../middlewares/ValidateRequest"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(client_1.Role.USER), (0, ValidateRequest_1.default)(orderValidation_1.OrderValidation.createOrderValidation), order_controller_1.OrderController.createOrder);
router.get('/my-orders', (0, auth_1.default)(client_1.Role.USER), order_controller_1.OrderController.getUserOrders);
router.get('/', (0, auth_1.default)(client_1.Role.ADMIN), order_controller_1.OrderController.getAllOrders);
router.patch('/:id/status', (0, auth_1.default)(client_1.Role.ADMIN), order_controller_1.OrderController.updateOrderStatus);
exports.OrderRoutes = router;
