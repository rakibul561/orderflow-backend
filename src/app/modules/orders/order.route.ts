import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { OrderValidation } from './orderValidation';
import validateRequest from '../../middlewares/ValidateRequest';
import { Role } from '@prisma/client';

const router = express.Router();


router.post(
    '/',
    auth( Role.USER), 
    validateRequest(OrderValidation.createOrderValidation),
    OrderController.createOrder
);

router.get(
    '/my-orders',
    auth(Role.USER),
    OrderController.getUserOrders
);


router.get(
    '/',
    auth(Role.ADMIN),
    OrderController.getAllOrders
);

router.patch(
    '/:id/status',
    auth(Role.ADMIN),
    OrderController.updateOrderStatus
);

export const OrderRoutes = router;