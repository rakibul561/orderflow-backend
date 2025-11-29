import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { OrderRoutes } from '../modules/orders/order.route';



const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/login',
        route: AuthRoutes
    },
    {
        path: '/orders',
        route: OrderRoutes
    },
   
  
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;