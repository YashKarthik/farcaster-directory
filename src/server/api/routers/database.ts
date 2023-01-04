import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { verifyOnFarcaster } from "../../../utils/verify";

export const supabaseRouter = createTRPCRouter({
  verifyCast: publicProcedure
    .input(z.object({
      twitterHandle: z.string(),
      fName: z.string(),
      castLink: z.string().url()
    }))
    .mutation(async ({ input }) => {
      const castVerification = await verifyOnFarcaster(input.twitterHandle, input.fName, input.castLink);
      return castVerification;
    }),
});
