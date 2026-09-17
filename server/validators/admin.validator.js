import { z } from "zod";

export const documentVerificationSchema = z.object({
  status: z.enum(["verified", "rejected"]),
  reason: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.status === "rejected" && (!data.reason || data.reason.trim().length < 5)) {
    ctx.addIssue({
      path: ["reason"],
      code: z.ZodIssueCode.custom,
      message: "Rejection reason is required and must be at least 5 characters",
    });
  }
});

export const userStatusSchema = z.object({
  status: z.enum(["active", "banned", "suspended"]),
  reason: z.string().optional(),
});

export const systemSettingsSchema = z.object({
  platformFeePercentage: z.number().min(0).max(100).optional(),
  globalAnnouncement: z.string().max(500).optional(),
  maintenanceMode: z.boolean().optional(),
  adminName: z.string().optional(),
  adminEmail: z.string().email().optional(),
});

export const universityCreationSchema = z.object({
  name: z.string().min(2, "University name must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  sector: z.enum(["Public", "Private"]),
  email: z.string().email().optional(),
  contactPhone: z.string().optional(),
  officialWebsite: z.string().url().optional(),
});
