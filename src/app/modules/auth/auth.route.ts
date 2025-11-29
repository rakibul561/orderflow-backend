
 import  express  from 'express';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';
 
  
 
 
 
  const router = express.Router();
 
  router.post("/", AuthController.login);
 
 
 
  export const AuthRoutes= router;