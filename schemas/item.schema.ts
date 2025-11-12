import { z } from "zod";

// Item params schema
export const itemParamsSchema = z.object({
  item_id: z.string().min(1, "Item ID is required")
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
  test: z.string().min(1, "Search text is required")
});

// Item body schemas
export const createItemSchema = z.object({
  item_name: z.string().min(1, "Item name is required").optional().default(""),
  item_price: z.number().min(0, "Item price must be non-negative").optional().default(0),
  item_quantity: z.number().int().min(0, "Item quantity must be non-negative").optional().default(0),
  item_description: z.string().optional().default(""),
  gst: z.number().min(0, "GST must be non-negative").optional().default(0),
  company_id: z.string().min(1, "Company ID is required").optional().default("1")
});

export const updateItemSchema = z.object({
  item_name: z.string().min(1, "Item name is required").optional(),
  item_price: z.number().min(0, "Item price must be non-negative").optional(),
  item_quantity: z.number().int().min(0, "Item quantity must be non-negative").optional(),
  item_description: z.string().optional(),
  gst: z.number().min(0, "GST must be non-negative").optional(),
  company_id: z.string().min(1, "Company ID is required").optional()
});

// Type exports
export type ItemParams = z.infer<typeof itemParamsSchema>;
export type PageParams = z.infer<typeof pageParamsSchema>;
export type FilterParams = z.infer<typeof filterParamsSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;