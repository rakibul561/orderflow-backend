import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { OrderValidation } from './orderValidation';
import validateRequest from '../../middlewares/ValidateRequest';
import { Role } from '@prisma/client';

const router = express.Router();

// ✅ Auth middleware enable kora holo
router.post(
    '/',
    auth( Role.USER), // ✅ Uncommented
    validateRequest(OrderValidation.createOrderValidation),
    OrderController.createOrder
);

router.get(
    '/my-orders',
    auth('user', 'admin'),
    OrderController.getUserOrders
);

router.get(
    '/:id',
    auth('user', 'admin'),
    OrderController.getOrderById
);

router.get(
    '/',
    auth('admin'),
    OrderController.getAllOrders
);

router.patch(
    '/:id/status',
    auth('admin'),
    validateRequest(OrderValidation.updateOrderStatusValidation),
    OrderController.updateOrderStatus
);

export const OrderRoutes = router;