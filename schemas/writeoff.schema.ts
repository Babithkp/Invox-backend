import { z } from "zod";

// Writeoff params schema
export const writeoffParamsSchema = z.object({
  write_off_id: z.string().min(1, "Write-off ID is required")
});

// Writeoff body schemas
export const createWriteoffSchema = z.object({
  invoice_id: z.string().min(1, "Invoice ID is required"),
  amount: z.number().int().min(0, "Amount must be non-negative"),
  reason: z.string().min(1, "Reason is required")
});

export const updateWriteoffSchema = z.object({
  invoice_id: z.string().min(1, "Invoice ID is required").optional(),
  amount: z.number().int().min(0, "Amount must be non-negative").optional(),
  reason: z.string().min(1, "Reason is required").optional()
});

// Type exports
export type WriteoffParams = z.infer<typeof writeoffParamsSchema>;
export type CreateWriteoffInput = z.infer<typeof createWriteoffSchema>;
export type UpdateWriteoffInput = z.infer<typeof updateWriteoffSchema>;