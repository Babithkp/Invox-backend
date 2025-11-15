import type { Request, Response } from "express";
import { z } from "zod";
import prisma from "../src/prismaClient.js";
import { 
  writeoffParamsSchema, 
  createWriteoffSchema,
  updateWriteoffSchema
} from "../schemas/writeoff.schema.js";
import type { 
  WriteoffParams,
  CreateWriteoffInput,
  UpdateWriteoffInput
} from "../schemas/writeoff.schema.js";

// GET /writeoff/:write_off_id
export const getWriteoff = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = writeoffParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const { write_off_id }: WriteoffParams = paramsResult.data;

    const writeoffs = await prisma.writeoff.findMany({
      where: { write_off_id },
    });

    if (!writeoffs || writeoffs.length === 0) {
      return res.status(404).json({ message: "Write-off not found" });
    }

    return res.status(200).json(writeoffs);
  } catch (err) {
    console.error("GET /writeoff/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /writeoff/:write_off_id
export const createWriteoff = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = writeoffParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    // Validate body with Zod
    const bodyResult = createWriteoffSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const { write_off_id }: WriteoffParams = paramsResult.data;
    const { invoice_id, amount, reason }: CreateWriteoffInput = bodyResult.data;

    const existing = await prisma.writeoff.findFirst({ where: { write_off_id } });

    if (existing) {
      return res.status(404).json({ message: "Write-off already exists" });
    }

    await prisma.writeoff.create({
      data: {
        write_off_id,
        invoice_id,
        amount,
        reason,
      },
    });

    return res.status(200).json({ message: "Write-off recorded successfully" });
  } catch (err) {
    console.error("POST /writeoff/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /writeoff/:write_off_id
export const updateWriteoff = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = writeoffParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    // Check if body is empty for PUT
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    // Validate body with Zod
    const bodyResult = updateWriteoffSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const { write_off_id }: WriteoffParams = paramsResult.data;
    const { invoice_id, amount, reason }: UpdateWriteoffInput = bodyResult.data;

    const existing = await prisma.writeoff.findFirst({ where: { write_off_id } });

    if (!existing) {
      return res.status(404).json({ message: "Write-off not found" });
    }

    // Filter out undefined values for update
    const updateData: any = {};
    if (invoice_id !== undefined) updateData.invoice_id = invoice_id;
    if (amount !== undefined) updateData.amount = amount;
    if (reason !== undefined) updateData.reason = reason;

    await prisma.writeoff.update({
      where: { write_off_id },
      data: updateData,
    });

    return res.status(200).json({ message: "Write-off updated successfully" });
  } catch (err) {
    console.error("PUT /writeoff/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /writeoff/:write_off_id
export const deleteWriteoff = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = writeoffParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ message: "Invalid request or bad input" });
    }

    const { write_off_id }: WriteoffParams = paramsResult.data;

    const existing = await prisma.writeoff.findFirst({ where: { write_off_id } });

    if (!existing) {
      return res.status(404).json({ message: "Write-off not found" });
    }

    await prisma.writeoff.delete({ where: { write_off_id } });

    return res.status(200).json({ message: "Write-off deleted successfully" });
  } catch (err) {
    console.error("DELETE /writeoff/:id error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};