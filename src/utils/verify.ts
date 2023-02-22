import { TRPCError } from "@trpc/server";
import { env } from "../env/server.mjs";

type User = {
  twitterHandle: string
  twitterID: number;
  fName: string,
  fId: number,
  fPfp: string,
  fBio: string,
  custodyAddress: string,
  connectedAddresses: string[],
  farcasterFollowersFID: number[];
}

export const updateFollowers = async (fId: number, twitterID: number): Promise<{farcasterFollowersFID: number[], twitterFollowers: string[]}> => {
  const fcFollowersRes = await fetch(`https://api.warpcast.com/v2/followers?fid=${fId}`, {
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${env.FC_APPLICATION_BEARER_TOKEN}`
    }
  });
  if (!fcFollowersRes.ok) throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: `Error fetchin Farcaster followers for FID:${fId}`
  });
  const fcFollowersObj = await fcFollowersRes.json();
  const farcasterFollowersFID = fcFollowersObj.result.users.map(({ fid }:{ fid: string;}) => fid);

  const twitterFollowersRes = await fetch(`https://api.twitter.com/2/users/${twitterID}/followers`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.TWITTER_BEARER_TOKEN}`
    }
  });
  if (!twitterFollowersRes.ok) throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: `ERROR in updateTwitterFollowers() for twitterID: ${twitterID}`
  })
  const twitterFollowersObj = await twitterFollowersRes.json();
  if (twitterFollowersObj.errors) throw new TRPCError({
    code: "NOT_FOUND",
    message: `Error fetching Twitter followers for ${twitterID} in updateTwitterFollowers()`
  });
  const twitterFollowers: string[] = twitterFollowersObj.data.map(({ username }: { username: string}) => username);
  return {
    farcasterFollowersFID,
    twitterFollowers,
  };
}

export const getUserData = async (
  twitterHandle: string,
  fName: string
): Promise<User> => {
  const userRes = await fetch(`https://api.warpcast.com/v2/user-by-username?username=${fName}`, {
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${env.FC_APPLICATION_BEARER_TOKEN}`
    }
  });
  if (!userRes.ok) throw new TRPCError({
    code: "NOT_FOUND",
    message: `User with FNAME=${fName} not found`
  });
  const user = await userRes.json();
  const fId : number = user.result.user.fid;
  const fPfp: string = user.result.user.pfp.url;
  const fBio: string = user.result.user.profile.bio.text;

  const custodyAddressRes = await fetch(`https://api.warpcast.com/v2/custody-address?fname=${fName}`, {
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${env.FC_APPLICATION_BEARER_TOKEN}`
    }
  });
  if (!custodyAddressRes.ok) throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Error while fetching custody address"
  })
  const custodyAddressObj = await custodyAddressRes.json();
  const custodyAddress = custodyAddressObj.result.custodyAddress;

  const connectedAddressRes = await fetch(`https://api.warpcast.com/v2/verifications?fid=${fId}`, {
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${env.FC_APPLICATION_BEARER_TOKEN}`
    }
  });
  if (!connectedAddressRes.ok) throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Error while fetching connected address"
  })
  const connectedAddressObj = await connectedAddressRes.json();
  const connectedAddresses: string[] = connectedAddressObj.result.verifications.map(({ address }:{ address: string;}) => address);

  const fcFollowersRes = await fetch(`https://api.warpcast.com/v2/followers?fid=${fId}`, {
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${env.FC_APPLICATION_BEARER_TOKEN}`
    }
  });
  if (!fcFollowersRes.ok) throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: `Error fetchin Farcaster followers for ${fName}`
  });
  const fcFollowersObj = await fcFollowersRes.json();
  const farcasterFollowersFID = fcFollowersObj.result.users.map(({ fid }:{ fid: string;}) => fid);
  // not doing twitter followers here cuz of rate-limiting. Will do via cron.
  const twitterUserDataRes = await fetch(`https://api.twitter.com/2/users/by/username/${twitterHandle}?user.fields=id`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.TWITTER_BEARER_TOKEN}`
    }
  });
  if (!twitterUserDataRes.ok) throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: `Error fetching Twitter profile for ${twitterHandle}. Try again.`
  });
  const twitterUserData = await twitterUserDataRes.json();

  if (twitterUserData.errors) throw new TRPCError({
    code: "NOT_FOUND",
    message: "Check if twitter username is correct"
  });
  const twitterID = twitterUserData.data.id;
  
  return {
    twitterHandle,
    twitterID,
    fName,
    fId,
    fPfp,
    fBio,
    custodyAddress,
    connectedAddresses,
    farcasterFollowersFID,
  }
}

type VerifiedOnFarcaster = {
  user: User,
  cast: {
    castLink: string,
    castText: string,
    castTimestamp: string
  }
}

export const verifyOnFarcaster = async (
  twitterHandle: string,
  fName: string,
  castLink: string
): Promise<VerifiedOnFarcaster> => {
  const user = await getUserData(twitterHandle, fName);
  const cast = `@directory Verifying my Farcaster account. Farcaster: \"${fName}\" Twitter: \"${twitterHandle}\"`;
  const castHash = castLink.slice(85,);
  const castCheckRes = await fetch(`https://api.warpcast.com/v2/cast?hash=${castHash}`, {
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${env.FC_APPLICATION_BEARER_TOKEN}`
    }
  });
  const castCheck = await castCheckRes.json();
  const castText: string = castCheck.result.cast.text;
  const castTimestamp: string = castCheck.result.cast.timestamp;

  if (cast != castText) throw new TRPCError({
    code: "PARSE_ERROR",
    message: 'Check if cast follows specified format.'
  })

  return {
    user,
    cast: {
      castLink,
      castText,
      castTimestamp
    }
  }
}

type VerifiedOnTwitter = {
  user: User,
  tweet: {
    tweetLink: string,
    tweetContent: string,
    tweetTimestamp: string
  }
}

type Tweet = {
  id: string,
  text: string,
  created_at: string,
}

export const verifyOnTwitter = async (
  twitterHandle: string,
  fName: string
): Promise<VerifiedOnTwitter> => {
  const userData = await getUserData(twitterHandle, fName);
  const tweetFormat = `@fc_directory Verifying my Farcaster account. Farcaster: \"${fName}\" Twitter: \"${twitterHandle}\"`;

  const userTimelineRes = await fetch(`https://api.twitter.com/2/users/${userData.twitterID}/tweets?tweet.fields=created_at`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.TWITTER_BEARER_TOKEN}`
    }
  });
  if (!userTimelineRes.ok) throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Error while fetching user tweets."
  });
  const { data }: { data: Tweet[] } = await userTimelineRes.json();
  let verificationTweet: (VerifiedOnTwitter["tweet"]|undefined);
  console.log(data);

  data.map(tweet => {
    if (tweetFormat == tweet.text) {
      verificationTweet = {
        tweetLink: `https://twitter.com/${twitterHandle}/status/${tweet.id}`,
        tweetContent: tweet.text,
        tweetTimestamp: tweet.created_at,
      }
    }
  });

  if (typeof verificationTweet == "undefined") throw new TRPCError({
    code: 'NOT_FOUND',
    message:  'Could not find tweet. Check if tweet follows specified format?'
  });
  
  return {
    user: userData,
    tweet: verificationTweet!
  }
}
