// user.service.ts
import { Request } from "express";
import bcrypt from "bcryptjs"; 
import { prisma } from "../../../config/prisma";




const createUser = async (req: Request) => {
    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create user data based on your actual schema
    const userData = {
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name,
        role: req.body.role || "USER" 
    };

    // Create user in database
    const result = await prisma.user.create({
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
};


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

export const UserService = {
    createUser,
    
};