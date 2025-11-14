import { z } from "zod";

// Item params schema
export const itemParamsSchema = z.object({
  item_id: z.string().min(1, "Item ID is required")
});

// Item body schemas
export const createItemSchema = z.object({
  item_name: z.string().min(1, "Item name is required"),
  item_price: z.number().int().min(0, "Item price must be non-negative"),
  item_quantity: z.number().int().min(0, "Item quantity must be non-negative"),
  item_description: z.string().min(1, "Item description is required"),
  gst: z.number().int().min(0, "GST must be non-negative"),
  company_id: z.string().min(1, "Company ID is required")
});

export const updateItemSchema = z.object({
  item_name: z.string().min(1, "Item name is required").optional(),
  item_price: z.number().int().min(0, "Item price must be non-negative").optional(),
  item_quantity: z.number().int().min(0, "Item quantity must be non-negative").optional(),
  item_description: z.string().min(1, "Item description is required").optional(),
  gst: z.number().int().min(0, "GST must be non-negative").optional(),
  company_id: z.string().min(1, "Company ID is required").optional()
});

// Type exports
export type ItemParams = z.infer<typeof itemParamsSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;