import { z } from "zod";

// Company params schema
export const companyParamsSchema = z.object({
  company_id: z.string().min(1, "Company ID is required")
});

// Company body schemas
export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().min(1, "Address is required"),
  mobile_number: z.string().min(10, "Mobile number must be at least 10 digits")
});

export const updateCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  address: z.string().min(1, "Address is required").optional(),
  mobile_number: z.string().min(10, "Mobile number must be at least 10 digits").optional()
});

// Type exports
export type CompanyParams = z.infer<typeof companyParamsSchema>;
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;