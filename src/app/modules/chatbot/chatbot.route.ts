import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import { chatController } from "./chatbot.controller";
import  express  from 'express';
import validateRequest from "../../middlewares/ValidateRequest";
import { chatValidation } from "./chatbot.validation";

 


 const router = express.Router();



router.post(
  '/chat',
  auth(Role.USER, Role.ADMIN),
  validateRequest(chatValidation.chatMessage),
  chatController.chatWithBot
);



router.get(
  '/my-history',
  auth(Role.USER, Role.ADMIN),
  chatController.getChatHistory
);

export const ChatbotRoutes = router;
