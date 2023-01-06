import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createClient } from '@supabase/supabase-js'
import { verifyOnFarcaster, verifyOnTwitter } from "../../../utils/verify";
import { env } from "../../../env/server.mjs";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

const checkTwitterFarcasterPair = async (twitterHandle: string, fId: number) => {
  const { data, error } = await supabase
    .from('directory')
    .select('fid, twitter_username')
    .eq('fid', fId);

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
  verifyTweet: publicProcedure
    .input(z.object({
      twitterHandle: z.string(),
      fName: z.string(),
    }))
    .mutation(async ({ input }) => {
      const isPaired = await checkTwitterFarcasterPair('_yashkarthik', 1600);
      if (typeof isPaired == "string") return 'Error has occured';

      const tweetVerification = await verifyOnTwitter(input.twitterHandle, input.fName);
      if (typeof tweetVerification == "string") return 'Cast text does not match format.';

      if (isPaired == true) {
        // update instead of insert, cuz the pair exists
        const { error } = await supabase
          .from('directory')
          .update({
            fname: tweetVerification.user.fName,
            custody_address: tweetVerification.user.custodyAddress,
            connected_address: tweetVerification.user.connectedAddresses,
            tweet_timestamp: tweetVerification.tweet.tweetTimestamp,
            tweet_content: tweetVerification.tweet.tweetContent,
            tweet_link: tweetVerification.tweet.tweetLink
          })
          .eq('fid', tweetVerification.user.fId)
          .eq('twitter_username', tweetVerification.user.twitterHandle);

        if (error) {
          console.log('Error while updating data:\n', error);
          return 'Error while updating data.';
        }
        return 'ok'
      } else {
        // Insert row cuz the twitter username and FID are not yet paired.
        const { error } = await supabase
          .from('directory')
          .insert({
            fid: tweetVerification.user.fId,
            fname: tweetVerification.user.fName,
            twitter_username: tweetVerification.user.twitterHandle,
            custody_address: tweetVerification.user.custodyAddress,
            connected_address: tweetVerification.user.connectedAddresses,
            tweet_timestamp: tweetVerification.tweet.tweetTimestamp,
            tweet_content: tweetVerification.tweet.tweetContent,
            tweet_link: tweetVerification.tweet.tweetLink
          });
        if (error) {
          console.log('Error while inserting data:\n', error);
          return 'Error while inserting data into database.';
        }
        return 'ok';
      }
    }),
  verifyCast: publicProcedure
    .input(z.object({
      twitterHandle: z.string(),
      fName: z.string(),
      castLink: z.string().url()
    }))
    .mutation(async ({ input }) => {
      const isPaired = await checkTwitterFarcasterPair('_yashkarthik', 1600);
      if (typeof isPaired == "string") return 'Error has occured';

      const castVerification = await verifyOnFarcaster(input.twitterHandle, input.fName, input.castLink);
      if (typeof castVerification == "string") return 'Cast text does not match format.';

      if (isPaired == true) {
        // update instead of insert, cuz the pair exists
        const { error } = await supabase
          .from('directory')
          .update({
            fname: castVerification.user.fName,
            custody_address: castVerification.user.custodyAddress,
            connected_address: castVerification.user.connectedAddresses,
            cast_timestamp: castVerification.cast.castTimestamp,
            cast_content: castVerification.cast.castText,
            cast_link: castVerification.cast.castLink
          })
          .eq('fid', castVerification.user.fId)
          .eq('twitter_username', castVerification.user.twitterHandle);

        if (error) {
          console.log('Error while updating data:\n', error);
          return 'Error while updating data.';
        }
        return 'ok'
      } else {
        // Insert row cuz the twitter username and FID are not yet paired.
        const { error } = await supabase
          .from('directory')
          .insert({
            fid: castVerification.user.fId,
            fname: castVerification.user.fName,
            twitter_username: castVerification.user.twitterHandle,
            custody_address: castVerification.user.custodyAddress,
            connected_address: castVerification.user.connectedAddresses,
            cast_timestamp: castVerification.cast.castTimestamp,
            cast_content: castVerification.cast.castText,
            cast_link: castVerification.cast.castLink
          });
        if (error) {
          console.log('Error while inserting data:\n', error);
          return 'Error while inserting data into database.';
        }
        return 'ok';
      }
    }),
});
