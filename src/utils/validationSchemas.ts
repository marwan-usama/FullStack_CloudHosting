import * as z from "zod";
export const CreateArticleSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
});

export const UpdateArticleSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  body: z.string().min(10).optional(),
});

export const CreateUserSchema = z.object({
  // Username: 3-20 characters, alphanumeric and underscore [3, 4]
  username: z.string().min(3, "Username must be at least 3 characters").max(20),

  // Email: Valid email format [4, 7]
  email: z.string().email("Invalid email address"),

  // Password: Minimum 8 characters, optionally add regex for complexity [3, 7]
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export const UpdateUserSchema = z.object({
  // Username: 3-20 characters, alphanumeric and underscore [3, 4]
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20)
    .optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
});

export const LoginUserSchema = z.object({
  // Email: Valid email format [4, 7]
  email: z.string().email("Invalid email address"),
  // Password: Minimum 8 characters, optionally add regex for complexity [3, 7]
  password: z.string().min(8, "Password must be at least 8 characters"),
});
