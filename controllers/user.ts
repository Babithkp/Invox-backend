import type { Request, Response } from "express";
import { z } from "zod";
import prisma from "../src/prismaClient";
import { 
  userParamsSchema, 
  pageParamsSchema,
  filterParamsSchema,
  createUserSchema,
  updateUserSchema
} from "../schemas/user.schema";
import type { 
  UserParams,
  PageParams,
  FilterParams,
  CreateUserInput,
  UpdateUserInput
} from "../schemas/user.schema";

// GET /user/:user_id
export const getUser = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = userParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { user_id }: UserParams = paramsResult.data;

    const user = await prisma.user.findFirst({ where: { user_id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't return password in response
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// POST /user/:user_id
export const createUser = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = userParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    // Validate body with Zod
    const bodyResult = createUserSchema.safeParse(req.body);
    if (!bodyResult.success) {
      const errors = bodyResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { user_id }: UserParams = paramsResult.data;
    const { email, password, role }: CreateUserInput = bodyResult.data;

    const existing = await prisma.user.findFirst({ where: { user_id } });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findFirst({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    await prisma.user.create({
      data: {
        user_id,
        email,
        password,
        role,
      },
    });

    return res.status(200).json({ message: "User created successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// PUT /user/:user_id
export const updateUser = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = userParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    // Validate body with Zod
    const bodyResult = updateUserSchema.safeParse(req.body || {});
    if (!bodyResult.success) {
      const errors = bodyResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { user_id }: UserParams = paramsResult.data;
    const updateData: UpdateUserInput = bodyResult.data;

    const existing = await prisma.user.findFirst({ where: { user_id } });
    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out undefined values for update
    const filteredUpdateData: any = {};
    if (updateData.email !== undefined) filteredUpdateData.email = updateData.email;
    if (updateData.password !== undefined) filteredUpdateData.password = updateData.password;
    if (updateData.role !== undefined) filteredUpdateData.role = updateData.role;

    await prisma.user.update({
      where: { user_id },
      data: filteredUpdateData,
    });

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// DELETE /user/:user_id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = userParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { user_id }: UserParams = paramsResult.data;

    const existing = await prisma.user.findFirst({ where: { user_id } });
    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({ where: { user_id } });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// GET /userPage/:page
export const getUserPage = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = pageParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { page }: PageParams = paramsResult.data;
    const pageNum = parseInt(page, 10);

    const pageSize = 10;
    const skip = (pageNum - 1) * pageSize;

    let totalItems = 0;
    try {
      totalItems = await prisma.user.count();
    } catch {
      const maybeAll = await prisma.user.findMany();
      totalItems = maybeAll ? maybeAll.length : 0;
    }

    const users = await prisma.user.findMany({
      skip,
      take: pageSize,
    });

    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    return res.status(200).json({
      totalItems,
      totalPages,
      currentPage: pageNum,
      data: usersWithoutPasswords,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// GET /filterUser/:text
export const filterUser = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = filterParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { text }: FilterParams = paramsResult.data;

    const users = await prisma.user.findMany();

    const query = text.toLowerCase().trim();
    const filtered = users.filter((user) => {
      const email = (user.email || "").toLowerCase();
      const role = (user.role || "").toLowerCase();
      return email.includes(query) || role.includes(query);
    });

    // Remove passwords from response
    const filteredWithoutPasswords = filtered.map(({ password, ...user }) => user);

    return res.status(200).json(filteredWithoutPasswords);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};