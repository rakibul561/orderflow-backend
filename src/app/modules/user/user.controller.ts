import { Request, Response } from "express";

import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.services";
import httpStatus from "http-status";





const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createUser(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User created successfully!",
        data: result
    });
});



// const getMyProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
//     const user = req.user;

//     const result = await UserService.getMyProfile(user as IJWTPayload);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Profile data fetched successfully!",
//         data: result
//     });
// });



// const getUserById = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;

//     const result = await UserService.getUserById(id);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "User retrieved successfully!",
//         data: result
//     });
// });

// const deleteUser = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;

//     const result = await UserService.deleteUser(id);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "User deleted successfully!",
//         data: result
//     });
// });

export const UserController = {
    createUser,
   
};