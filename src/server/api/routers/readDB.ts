import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createClient } from '@supabase/supabase-js'
import { env } from "../../../env/server.mjs";
import { TRPCError } from "@trpc/server";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

export const supabaseReadRouter = createTRPCRouter({
  fetchBasicData: publicProcedure
    .query(async () => {
      const { data, error } = await supabase
        .from('directory')
        .select('fid, fname, twitter_username, cast_timestamp, tweet_timestamp')

      if (error) {
        console.log('Error in supa fetch readDB.ts:\n', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error while fetching data from Supabase.'
        });
      }
      return data;
    }),
});
