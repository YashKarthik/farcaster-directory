import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const example2Router = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({
        name: z.string(),
        from: z.string(),
        birthdate: z.date()
    }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name}, from ${input.from}, born ${input.birthdate}`,
      };
    }),
});
