import { z } from "zod";

const updateBusSchema = z.object({
  current_lat: z.number(),
  current_long: z.number(),
  bearing: z.number().nullable().optional(),
});

export { updateBusSchema };
