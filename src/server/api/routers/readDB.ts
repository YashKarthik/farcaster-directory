import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createClient, PostgrestResponse } from '@supabase/supabase-js'
import { env } from "../../../env/server.mjs";
import { TRPCError } from "@trpc/server";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

const Users = z.object({
  fid: z.number(),
  fname: z.string().min(1),
  twitter_username: z.string().min(3),
  cast_timestamp: z.string().optional().nullable(),
  tweet_timestamp: z.string().optional().nullable(),
  cast_content: z.string().optional().nullable(),
  tweet_content: z.string().optional().nullable(),
  cast_link: z.string().url().optional().nullable(),
  tweet_link: z.string().url().optional().nullable(),
}).array();

export const supabaseReadRouter = createTRPCRouter({
  fetchBasicData: publicProcedure
    .input(
      z.object({
        fid: z.number()
      })
      .optional(),
    )
    .query(async ({ input }) => {

      let query = supabase
        .from('directory')
        .select('fid, fname, twitter_username, cast_timestamp, tweet_timestamp')

      if (input?.fid) query = query.eq('fid', input.fid);

      const { data, error } = await query;

      if (error) {
        console.log('Error in supa fetch readDB.ts:\n', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error while fetching data from Supabase.'
        });
      }
      Users.parse(data);
      return data as z.infer<typeof Users>;
    }),

  fetchCount: publicProcedure
    .query(async () => {
      const { count, error } = await supabase
        .from('directory')
        .select('*', { count: 'estimated', head: true});

      if (error) {
        console.log('Error in supa fetch readDB.ts:\n', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error while fetching data from Supabase.'
        });
      }
      return count;
    }),
});
