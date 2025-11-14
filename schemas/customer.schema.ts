import { z } from "zod";

// Customer params schema
export const customerParamsSchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required")
});

// Customer body schemas
export const createCustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email format"),
  address: z.string().min(1, "Address is required"),
  mobile_number: z.string().min(10, "Mobile number must be at least 10 digits"),
  customer_gst: z.string().min(1, "Customer GST is required")
});

export const updateCustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  address: z.string().min(1, "Address is required").optional(),
  mobile_number: z.string().min(10, "Mobile number must be at least 10 digits").optional(),
  customer_gst: z.string().min(1, "Customer GST is required").optional()
});

// Type exports
export type CustomerParams = z.infer<typeof customerParamsSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;