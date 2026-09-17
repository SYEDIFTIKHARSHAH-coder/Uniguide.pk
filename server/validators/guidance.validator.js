import { z } from "zod";

export const guidanceArticleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.enum([
    "career", 
    "university", 
    "degree", 
    "admission", 
    "scholarship", 
    "faq", 
    "tips"
  ]),
  thumbnailUrl: z.string().url().optional(),
  readTimeMinutes: z.number().int().positive(),
  tags: z.array(z.string()).optional(),
  author: z.string().min(2),
  content: z.string().min(50, "Content is too short. Must be at least 50 characters of HTML.")
});
