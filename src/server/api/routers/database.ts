import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createClient } from '@supabase/supabase-js'
import { verifyOnFarcaster } from "../../../utils/verify";
import { env } from "../../../env/server.mjs";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

const checkTwitterFarcasterPair = async (twitterHandle: string, fId: number) => {
  const { data, error } = await supabase
    .from('directory')
    .select('fid, twitter_username')
    .eq('fid', fId);

  console.log(data);
  if (error) {
    console.log('Error in supa fetch:\n', error);
    return 'Error has occured';
  }
  if (data.length == 0) return false;
  for (let i=0; i < data.length; i++) {
    if (data[i]!.fid == fId && data[i]!.twitter_username == twitterHandle) return true;
  }
  return false;
}

export const supabaseRouter = createTRPCRouter({
  verifyCast: publicProcedure
    .input(z.object({
      twitterHandle: z.string(),
      fName: z.string(),
      castLink: z.string().url()
    }))
    .mutation(async ({ input }) => {
      //const castVerification = await verifyOnFarcaster(input.twitterHandle, input.fName, input.castLink);
      //return castVerification;
      const isPaired = await checkTwitterFarcasterPair('_yashkarthik', 1600);
      console.log(isPaired);
      if (typeof isPaired == "string") return 'Error has occured';
      if (isPaired == true) {
        // update instead of insert, cuz the pair exists
      } else {
        // inseart cuz the pair doesn't yet exist
      }
      return 'ok';
    }),
});
