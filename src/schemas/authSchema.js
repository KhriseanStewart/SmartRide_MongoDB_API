import { z } from "zod";

const authSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  smart_card_num: z.union([z.string(), z.number()]).optional(),
});

const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const authChangePasswordSchema = z.object({
  email: z.string().email(),
  current_password: z.string().min(1),
  new_password: z.string().min(6),
});

const inviteDriverSchema = z.object({
  email: z.string().email(),
  driver_first_name: z.string().min(1),
  driver_last_name: z.string().min(1).optional(),
  driver_age: z.number().int().positive().optional(),
  telephone: z.string().optional(),
  telephone_number: z.string().optional(),
  password: z.string().min(6).optional(),
});

export { authSignupSchema, authLoginSchema, authChangePasswordSchema, inviteDriverSchema };
