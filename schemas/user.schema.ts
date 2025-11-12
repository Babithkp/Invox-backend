import { z } from "zod";

// User params schema
export const userParamsSchema = z.object({
  user_id: z.string().min(1, "User ID is required")
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

// User body schemas
export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Role is required")
});

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.string().min(1, "Role is required").optional()
});

// Type exports
export type UserParams = z.infer<typeof userParamsSchema>;
export type PageParams = z.infer<typeof pageParamsSchema>;
export type FilterParams = z.infer<typeof filterParamsSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;