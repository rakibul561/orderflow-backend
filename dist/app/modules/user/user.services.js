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
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../../config/prisma");
const createUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // Hash password
    const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, 10);
    // Create user data based on your actual schema
    const userData = {
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name,
        role: req.body.role || "USER"
    };
    // Create user in database
    const result = yield prisma_1.prisma.user.create({
        data: userData,
        select: {
            id: true,
            email: true,
            role: true,
            name: true,
            createdAt: true,
            updatedAt: true
        }
    });
    return result;
});
//     const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
//     const { searchTerm, ...filterData } = params;
//     const andConditions: Prisma.UserWhereInput[] = [];
//     if (searchTerm) {
//         andConditions.push({
//             OR: userSearchableFields.map(field => ({
//                 [field]: {
//                     contains: searchTerm,
//                     mode: "insensitive"
//                 }
//             }))
//         });
//     }
//     if (Object.keys(filterData).length > 0) {
//         andConditions.push({
//             AND: Object.keys(filterData).map(key => ({
//                 [key]: {
//                     equals: (filterData as any)[key]
//                 }
//             }))
//         });
//     }
//     const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
//         AND: andConditions
//     } : {};
//     const result = await prisma.user.findMany({
//         skip,
//         take: limit,
//         where: whereConditions,
//         orderBy: {
//             [sortBy]: sortOrder
//         },
//         select: {
//             id: true,
//             email: true,
//             role: true,
//             name: true,
//             createdAt: true,
//             updatedAt: true
//         }
//     });
//     const total = await prisma.user.count({
//         where: whereConditions
//     });
//     return {
//         meta: {
//             page,
//             limit,
//             total
//         },
//         data: result
//     };
// };
// const getMyProfile = async (user: IJWTPayload) => {
//     const userInfo = await prisma.user.findUniqueOrThrow({
//         where: {
//             email: user.email
//         },
//         select: {
//             id: true,
//             email: true,
//             role: true,
//             name: true,
//             createdAt: true,
//             updatedAt: true
//         }
//     });
//     return userInfo;
// };
// const updateMyProfile = async (user: IJWTPayload, req: Request) => {
//     await prisma.user.findUniqueOrThrow({
//         where: {
//             email: user?.email
//         }
//     });
//     // Only update allowed fields from your schema
//     const updateData: any = {};
//     if (req.body.name) updateData.name = req.body.name;
//     const profileInfo = await prisma.user.update({
//         where: {
//             email: user.email
//         },
//         data: updateData,
//         select: {
//             id: true,
//             email: true,
//             role: true,
//             name: true,
//             createdAt: true,
//             updatedAt: true
//         }
//     });
//     return profileInfo;
// };
// const getUserById = async (id: string) => {
//     const user = await prisma.user.findUniqueOrThrow({
//         where: { id },
//         select: {
//             id: true,
//             email: true,
//             role: true,
//             name: true,
//             createdAt: true,
//             updatedAt: true
//         }
//     });
//     return user;
// };
// const deleteUser = async (id: string) => {
//     await prisma.user.findUniqueOrThrow({
//         where: { id }
//     });
//     const result = await prisma.user.delete({
//         where: { id }
//     });
//     return result;
// };
exports.UserService = {
    createUser,
};
