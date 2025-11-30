import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { OrderRoutes } from '../modules/orders/order.route';
import { ChatbotRoutes } from '../modules/chatbot/chatbot.route';



const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/orders',
        route: OrderRoutes
    },
    {
        path: '/open-ai',
        route: ChatbotRoutes
    },
   
  
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;