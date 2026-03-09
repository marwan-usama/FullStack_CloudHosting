import * as z from "zod";
export const CreateArticleSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
});

export const UpdateArticleSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  body: z.string().min(10).optional(),
});