import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createClient } from '@supabase/supabase-js'
import { env } from "../../../env/server.mjs";
import { TRPCError } from "@trpc/server";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

const BasicUsersData = z.object({
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

const Users = z.object({
  fid: z.number(),
  fname: z.string().min(1),
  twitter_username: z.string().min(3),
  cast_timestamp: z.string().nullable(),
  tweet_timestamp: z.string().nullable(),
  cast_content: z.string().nullable(),
  tweet_content: z.string().nullable(),
  cast_link: z.string().url().nullable(),
  tweet_link: z.string().url().nullable(),
  custody_address: z.string(),
  connected_address: z.string().array(),
}).array();

export const supabaseReadRouter = createTRPCRouter({
  fetchBasicData: publicProcedure
    .query(async () => {

      const { data, error } = await supabase
        .from('directory')
        .select('fid, fname, twitter_username, cast_timestamp, tweet_timestamp');

      if (error) {
        console.log('Error in supa fetch readDB.ts:\n', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error while fetching data from Supabase.'
        });
      }
      BasicUsersData.parse(data);
      return data as z.infer<typeof BasicUsersData>;
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

  fetchUser: publicProcedure
    .input(
      z.object({
        fid: z.number()
      })
    )
    .query(async ({ input }) => {

      const { data, error } = await supabase
        .from('directory')
        .select('*')
        .eq('fid', input.fid)

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
});
