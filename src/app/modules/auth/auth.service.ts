
import bcrypt from "bcryptjs";

import httpStatus from "http-status"

import { emit } from "process";
import { prisma } from "../../../config/prisma";
import ApiError from "../../errors/AppError";
import { jwtHelper } from "../../helper/jwtHelper";
import { Secret } from "jsonwebtoken";
import config from "../../../config";

const login = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
         
        }
    })

    const isCorrectPassword = await bcrypt.compare(payload.password, user.password);
    if (!isCorrectPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Password is incorrect!")
    }

    const accessToken = jwtHelper.generateToken({ 
        email: user.email,
         role: user.role,
          id: user.id,  

        }, config.jwt.jwt_secret as Secret, config.jwt.expires_in as string);

    const refreshToken = jwtHelper.generateToken({ email: user.email, role: user.role }, config.jwt.refresh_token_secret as Secret, config.jwt.refresh_token_expires_in as string);

    return {
        accessToken,
        refreshToken,
       
    }
}



export const AuthService = {
    login,
   
}