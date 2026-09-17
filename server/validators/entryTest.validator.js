import { z } from "zod";

// Schema for adding/updating a new entry test (Admin only feature in reality)
export const entryTestSchema = z.object({
  name: z.string().min(2, "Test name is required"),
  organizingBody: z.string().min(2, "Organizing body is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  registrationLink: z.string().url("Must be a valid URL for official registration"),
  registrationDeadline: z.string().datetime(),
  testDate: z.string().datetime(),
  eligibilityCriteria: z.array(z.string()).min(1, "At least one eligibility criterion is required"),
  // Since we are hosting files ourselves, we expect URLs pointing to our Firebase Storage bucket
  syllabusFileUrl: z.string().url().optional(), 
  preparationMaterials: z.array(
    z.object({
      title: z.string(),
      fileUrl: z.string().url().optional(),
      externalLink: z.string().url().optional(),
      type: z.enum(["past_paper", "book", "notes", "video", "website"])
    })
  ).optional(),
});
