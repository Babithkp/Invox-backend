import { z } from "zod";

// Quote params schema
export const quoteParamsSchema = z.object({
  quote_id: z.string().min(1, "Quote ID is required")
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

// Quote body schemas
export const createQuoteSchema = z.object({
  quote_number: z.string().min(1, "Quote number is required"),
  quote_item: z.string().min(1, "Quote item is required"),
  total_amount: z.number().min(0, "Total amount must be non-negative")
});

export const updateQuoteSchema = z.object({
  quote_number: z.string().min(1, "Quote number is required").optional(),
  quote_item: z.string().min(1, "Quote item is required").optional(),
  total_amount: z.number().min(0, "Total amount must be non-negative").optional()
});

// Type exports
export type QuoteParams = z.infer<typeof quoteParamsSchema>;
export type PageQuery = z.infer<typeof pageQuerySchema>;
export type FilterParams = z.infer<typeof filterParamsSchema>;
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;