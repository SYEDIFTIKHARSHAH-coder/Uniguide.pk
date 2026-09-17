import { z } from "zod";

export const withdrawApplicationSchema = z.object({
  reason: z.string().min(10, "Please provide a reason of at least 10 characters for withdrawal."),
});
