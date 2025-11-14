import { z } from "zod";

// Settings params schema
export const settingsParamsSchema = z.object({
  company_id: z.string().min(1, "Company ID is required")
});

// Settings body schemas
export const createSettingsSchema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  company_name: z.string().min(1, "Company name is required"),
  company_address: z.string().min(1, "Company address is required"),
  company_gst: z.string().min(1, "Company GST is required"),
  account_details: z.any()
});

export const updateSettingsSchema = z.object({
  company_id: z.string().min(1, "Company ID is required").optional(),
  company_name: z.string().min(1, "Company name is required").optional(),
  company_address: z.string().min(1, "Company address is required").optional(),
  company_gst: z.string().min(1, "Company GST is required").optional(),
  account_details: z.any().optional()
});

// Type exports
export type SettingsParams = z.infer<typeof settingsParamsSchema>;
export type CreateSettingsInput = z.infer<typeof createSettingsSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;