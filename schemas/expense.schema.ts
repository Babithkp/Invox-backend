import { z } from "zod";

// Expense params schema
export const expenseParamsSchema = z.object({
  expense_id: z.string().min(1, "Expense ID is required")
});

// Page params schema
export const pageParamsSchema = z.object({
  page: z.string().refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 1;
  }, "Page must be a valid positive number")
});

// Filter params schema
export const filterParamsSchema = z.object({
  text: z.string().min(1, "Search text is required")
});

// Expense body schemas
export const createExpenseSchema = z.object({
  expense_name: z.string().min(1, "Expense name is required"),
  amount: z.number().int().min(0, "Amount must be non-negative"),
  expense_date: z.string().min(1, "Expense date is required")
});

export const updateExpenseSchema = z.object({
  expense_name: z.string().min(1, "Expense name is required").optional(),
  amount: z.number().int().min(0, "Amount must be non-negative").optional(),
  expense_date: z.string().min(1, "Expense date is required").optional()
});

// Type exports
export type ExpenseParams = z.infer<typeof expenseParamsSchema>;
export type PageParams = z.infer<typeof pageParamsSchema>;
export type FilterParams = z.infer<typeof filterParamsSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;