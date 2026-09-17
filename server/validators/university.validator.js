import { z } from "zod";

// Validates the program creation/update request
export const programSchema = z.object({
  name: z.string().min(3, "Program name must be at least 3 characters"),
  department: z.string().min(2, "Department is required"),
  degreeLevel: z.enum(["Bachelors", "Masters", "PhD", "Diploma"]),
  durationYears: z.number().min(1).max(7),
  creditHours: z.number().positive(),
  tuitionFee: z.number().nonnegative(),
  eligibilityCriteria: z.string().optional(),
});

// Validates opening a new admission cycle
export const admissionCycleSchema = z.object({
  title: z.string().min(5, "Title required (e.g., Fall 2026 Admissions)"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  programsIncluded: z.array(z.string()).min(1, "Select at least one program"),
});
