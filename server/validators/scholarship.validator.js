import { z } from "zod";

export const scholarshipSchema = z.object({
  name: z.string().min(5, "Scholarship name must be at least 5 characters"),
  type: z.string().min(2, "Type is required"),
  provider: z.string().optional(),
  description: z.string().optional(),
  amount: z.string().optional(),
  deadline: z.string().optional().or(z.date().optional()),
  applyLink: z.string().url().optional().or(z.literal("")),
  eligibility: z.string().optional(),
  requiredDocuments: z.array(z.string()).optional(),
  minMarks: z.number().min(0).max(100).optional().nullable(),
  incomeLimit: z.number().nonnegative().optional().nullable(),
});
