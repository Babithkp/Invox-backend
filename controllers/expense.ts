import type { Request, Response } from "express";
import { z } from "zod";
import prisma from "../src/prismaClient.js";
import { 
  expenseParamsSchema, 
  pageParamsSchema,
  filterParamsSchema,
  createExpenseSchema,
  updateExpenseSchema
} from "../schemas/expense.schema.js";
import type { 
  ExpenseParams,
  PageParams,
  FilterParams,
  CreateExpenseInput,
  UpdateExpenseInput
} from "../schemas/expense.schema.js";

// GET /expense/:expense_id
export const getExpense = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = expenseParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { expense_id }: ExpenseParams = paramsResult.data;

    const expense = await prisma.expense.findFirst({ where: { expense_id } });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json(expense);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// POST /expense/:expense_id
export const createExpense = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = expenseParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    // Validate body with Zod
    const bodyResult = createExpenseSchema.safeParse(req.body);
    if (!bodyResult.success) {
      const errors = bodyResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { expense_id }: ExpenseParams = paramsResult.data;
    const { expense_name, amount, expense_date }: CreateExpenseInput = bodyResult.data;

    const existing = await prisma.expense.findFirst({ where: { expense_id } });
    if (existing) {
      return res.status(409).json({ message: "Expense already exists" });
    }

    await prisma.expense.create({
      data: {
        expense_id,
        expense_name,
        amount,
        expense_date,
      },
    });

    return res.status(200).json({ message: "Expense created successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// PUT /expense/:expense_id
export const updateExpense = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = expenseParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    // Validate body with Zod
    const bodyResult = updateExpenseSchema.safeParse(req.body || {});
    if (!bodyResult.success) {
      const errors = bodyResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { expense_id }: ExpenseParams = paramsResult.data;
    const updateData: UpdateExpenseInput = bodyResult.data;

    const existing = await prisma.expense.findFirst({ where: { expense_id } });
    if (!existing) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Filter out undefined values for update
    const filteredUpdateData: any = {};
    if (updateData.expense_name !== undefined) filteredUpdateData.expense_name = updateData.expense_name;
    if (updateData.amount !== undefined) filteredUpdateData.amount = updateData.amount;
    if (updateData.expense_date !== undefined) filteredUpdateData.expense_date = updateData.expense_date;

    await prisma.expense.update({
      where: { expense_id },
      data: filteredUpdateData,
    });

    return res.status(200).json({ message: "Expense updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// DELETE /expense/:expense_id
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = expenseParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { expense_id }: ExpenseParams = paramsResult.data;

    const existing = await prisma.expense.findFirst({ where: { expense_id } });
    if (!existing) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await prisma.expense.delete({ where: { expense_id } });

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// GET /expensePage/:page
export const getExpensePage = async (req: Request, res: Response) => {
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
      totalItems = await prisma.expense.count();
    } catch {
      const maybeAll = await prisma.expense.findMany();
      totalItems = maybeAll ? maybeAll.length : 0;
    }

    const expenses = await prisma.expense.findMany({
      skip,
      take: pageSize,
      orderBy: {
        created_at: 'desc'
      }
    });

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    return res.status(200).json({
      totalItems,
      totalPages,
      currentPage: pageNum,
      data: expenses,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// GET /filterExpense/:text
export const filterExpense = async (req: Request, res: Response) => {
  try {
    // Validate params with Zod
    const paramsResult = filterParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map(err => err.message).join(", ");
      return res.status(400).json({ message: errors });
    }

    const { text }: FilterParams = paramsResult.data;

    const expenses = await prisma.expense.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    const query = text.toLowerCase().trim();
    const filtered = expenses.filter((expense) => {
      const name = (expense.expense_name || "").toLowerCase();
      const date = (expense.expense_date || "").toLowerCase();
      const amount = expense.amount.toString();
      return name.includes(query) || date.includes(query) || amount.includes(query);
    });

    return res.status(200).json(filtered);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};