import { z } from "zod";

export const notificationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  type: z.enum([
    "admission",
    "scholarship",
    "deadline",
    "application_status",
    "system"
  ]),
  recipientId: z.string().min(1, "Recipient user ID is required"),
  link: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const markReadSchema = z.object({
  notificationIds: z.array(z.string()).min(1, "At least one notification ID is required"),
});
