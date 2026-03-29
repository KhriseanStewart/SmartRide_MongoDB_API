import { z } from "zod";

const upsertUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  full_name: z.string().min(1),
  smart_card_num: z.union([z.string(), z.number()]).optional(),
});

const favoriteSchema = z.object({
  routeId: z.string().min(1),
});

export { upsertUserSchema, favoriteSchema };
