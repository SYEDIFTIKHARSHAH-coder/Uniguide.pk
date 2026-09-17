import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(5, "Course title must be at least 5 characters"),
  category: z.enum([
    "admission_preparation",
    "study_skills",
    "soft_skills",
    "career_development",
    "free_courses"
  ]),
  description: z.string().min(20, "Description must be at least 20 characters"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  thumbnailUrl: z.string().url().optional(),
  instructor: z.string().min(2),
  durationHours: z.number().positive(),
  modules: z.array(
    z.object({
      title: z.string(),
      lessons: z.array(
        z.object({
          title: z.string(),
          videoUrl: z.string().url().optional(),
          durationMinutes: z.number().positive(),
          content: z.string().optional(),
        })
      )
    })
  ).min(1, "At least one module is required"),
  isFree: z.boolean().default(true),
  price: z.number().nonnegative().optional(),
});

export const enrollSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
});
