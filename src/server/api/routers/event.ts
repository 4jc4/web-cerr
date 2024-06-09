import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const idSchema = z.object({ id: z.number() });

const createSchema = z.object({
  code: z.string().min(1, { message: "code is too short." }),
  name: z.string().min(3, { message: "name is too short." }),
});

const updateSchema = z.object({
  id: z.number(),
  code: z.string().optional(),
  name: z.string().optional(),
});

export const eventRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.event.findMany();
  }),

  create: publicProcedure.input(createSchema).mutation(({ ctx, input }) => {
    return ctx.db.event.create({
      data: {
        code: input.code,
        name: input.name,
      },
    });
  }),

  update: publicProcedure.input(updateSchema).mutation(({ ctx, input }) => {
    const { id, ...data } = input;

    return ctx.db.event.update({
      where: { id },
      data,
    });
  }),

  delete: publicProcedure.input(idSchema).mutation(({ ctx, input }) => {
    return ctx.db.event.delete({
      where: {
        id: input.id,
      },
    });
  }),
});
