import { z } from "zod";

// Invoice params schema
export const invoiceParamsSchema = z.object({
  invoice_id: z.string().min(1, "Invoice ID is required")
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

// Invoice body schemas
export const createInvoiceSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  invoice_item: z.string().min(1, "Invoice item is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  total_amount: z.number().min(0, "Total amount must be non-negative")
});

export const updateInvoiceSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required").optional(),
  invoice_item: z.string().min(1, "Invoice item is required").optional(),
  payment_method: z.string().min(1, "Payment method is required").optional(),
  total_amount: z.number().min(0, "Total amount must be non-negative").optional()
});

// Type exports
export type InvoiceParams = z.infer<typeof invoiceParamsSchema>;
export type PageQuery = z.infer<typeof pageQuerySchema>;
export type FilterParams = z.infer<typeof filterParamsSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;