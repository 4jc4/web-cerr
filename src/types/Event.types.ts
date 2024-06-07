import { type Prisma } from "~/server/db";
import { z } from "zod";

export const CreateEventZod = z.object({
  code: z.string(),
  name: z.string(),
});

export type CreateEventDto = z.infer<typeof CreateEventZod>;

export type Event = Prisma.EventGetPayload<Prisma.EventDefaultArgs>;
