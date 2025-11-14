import { z } from "zod";

// Payment params schema
export const paymentParamsSchema = z.object({
  payment_id: z.string().min(1, "Payment ID is required")
});

// Page query schema
export const pageQuerySchema = z.object({
  page: z.string().refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 1;
  }, "Page must be a valid positive number").default("1"),
  limit: z.string().refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 1 && num <= 100;
  }, "Limit must be between 1 and 100").default("10")
});

// Filter params schema
export const filterParamsSchema = z.object({
  text: z.string().min(1, "Search text is required")
});

// Payment body schemas
export const createPaymentSchema = z.object({
  invoice_id: z.string().min(1, "Invoice ID is required"),
  amount: z.number().int().min(0, "Amount must be non-negative")
});

export const updatePaymentSchema = z.object({
  invoice_id: z.string().min(1, "Invoice ID is required").optional(),
  amount: z.number().int().min(0, "Amount must be non-negative").optional()
});

// Type exports
export type PaymentParams = z.infer<typeof paymentParamsSchema>;
export type PageQuery = z.infer<typeof pageQuerySchema>;
export type FilterParams = z.infer<typeof filterParamsSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;