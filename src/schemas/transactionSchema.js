import { z } from "zod";

const createTransactionSchema = z.object({
  receiver_id: z.string().optional(),
  driver_id: z.string().optional(),
  route: z.string().optional(),
  amount: z.number().positive(),
  status: z.enum(["pending", "completed", "canceled"]).optional(),
  sent_at: z.coerce.date().optional(),
  received_at: z.coerce.date().optional(),
  paid_at: z.coerce.date().optional(),
});

const addCashSchema = z.object({
  amount: z.coerce.number().positive(),
});

export { createTransactionSchema, addCashSchema };
