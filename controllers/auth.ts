// controllers/auth.controller.ts
import type { Request, Response } from "express";
import { z } from "zod";
import prisma from "../src/prismaClient.js"; // <- IMPORTANT (not "../src/index.js")
import jwt from "jsonwebtoken";
import { 
  registerSchema, 
  loginSchema
} from "../schemas/auth.schema.js";
import type { 
  RegisterInput,
  LoginInput
} from "../schemas/auth.schema.js";

console.log("DEBUG controller create:", typeof prisma?.company?.create);
console.log("DEBUG controller update:", typeof prisma?.company?.update);

export const register = async (req: Request, res: Response) => {
  try {
    // Validate body with Zod
    const bodyResult = registerSchema.safeParse(req.body);
    if (!bodyResult.success) {
      const errors = bodyResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { email, password, role }: RegisterInput = bodyResult.data;

    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) {
      return res.status(401).json({ message: "User already exists" });
    }

    const created = await prisma.user.create({
      data: { email, password, role },
    });

    return res.status(200).json(created);
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate body with Zod
    const bodyResult = loginSchema.safeParse(req.body);
    if (!bodyResult.success) {
      const errors = bodyResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { email, password }: LoginInput = bodyResult.data;

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Use user.user_id (your DB uses user_id as primary id in tests)
    const payload = { userId: (user as any).user_id ?? (user as any).id ?? null };
    const secret = process.env.JWT_SECRET ?? "secret";
    const token = jwt.sign(payload, secret, { expiresIn: "24h" });

    return res.status(200).json({ token });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
