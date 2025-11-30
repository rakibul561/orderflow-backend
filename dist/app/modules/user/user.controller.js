"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const user_services_1 = require("./user.services");
const http_status_1 = __importDefault(require("http-status"));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserService.createUser(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User created successfully!",
        data: result
    });
}));
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
exports.UserController = {
    createUser,
};
