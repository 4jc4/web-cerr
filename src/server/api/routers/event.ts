import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const createSchema = z.object({
  code: z.string().min(1, { message: "code is too short." }),
  name: z.string().min(3, { message: "name is too short." }),
});

export const eventRouter = createTRPCRouter({
  create: publicProcedure.input(createSchema).mutation(({ ctx, input }) => {
    return ctx.db.event.create({
      data: {
        code: input.code,
        name: input.name,
      },
    });
  }),
});
