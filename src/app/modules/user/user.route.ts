import { UserController } from "./user.controller";
import  express  from 'express';

 



 const router = express.Router();

 router.post("/create-user", UserController.createUser);



 export const UserRoutes= router;