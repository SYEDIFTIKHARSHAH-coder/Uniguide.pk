import { z } from "zod";

export const reviewSchema = z.object({
  targetId: z.string().min(1, "Target ID (e.g., University ID) is required"),
  targetType: z.enum(["university", "scholarship"]),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(10, "Review comment must be at least 10 characters long").max(1000),
});

export const favoriteSchema = z.object({
  targetId: z.string().min(1, "Target ID is required"),
  targetType: z.enum(["university", "scholarship", "course"]),
});
