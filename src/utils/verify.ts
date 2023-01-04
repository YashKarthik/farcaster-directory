import { env } from "../env/server.mjs";

type User = {
  twitterHandle: string
  fName: string,
  fId: number,
  fPfp: string,
  fBio: string,
  custodyAddress: string,
  connectedAddresses: string[],
}

export const getUserData = async (
  twitterHandle: string,
  fName: string
): Promise<User> => {
  const userRes = await fetch(`https://api.farcaster.xyz/v2/user-by-username?username=${fName}`, {
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${env.FC_APPLICATION_BEARER_TOKEN}`
    }
  });
  const user = await userRes.json();
  const fId : number = user.result.user.fid;
  const fPfp: string = user.result.user.pfp.url;
  const fBio: string = user.result.user.profile.bio.text;

  const custodyAddressRes = await fetch(`https://api.farcaster.xyz/v2/custody-address?fname=${fName}`, {
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${env.FC_APPLICATION_BEARER_TOKEN}`
    }
  });
  const custodyAddressObj = await custodyAddressRes.json();
  const custodyAddress = custodyAddressObj.result.custodyAddress;

  const connectedAddressRes = await fetch(`https://api.farcaster.xyz/v2/verifications?fid=${fId}`, {
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${env.FC_APPLICATION_BEARER_TOKEN}`
    }
  });
  const connectedAddressObj = await connectedAddressRes.json();
  const connectedAddresses: string[] = connectedAddressObj.result.verifications.map((verification: {fid: number; address: string; timestamp: string}) => verification.address)

  return {
    twitterHandle,
    fName,
    fId,
    fPfp,
    fBio,
    custodyAddress,
    connectedAddresses
  }
}

type VerifiedOnTwitter  = {
  user: User,
  tweet: {
    tweetLink: string,
    tweetContent: string,
    tweetTimestamp: Date
  }
}

type VerifiedOnFarcaster = {
  user: User,
  cast: {
    castLink: string,
    castText: string,
    castTimestamp: Date
  }
}

export const verifyOnFarcaster = async (
  twitterHandle: string,
  fName: string,
  castLink: string
): Promise<VerifiedOnFarcaster|string> => {
  try {
    const user = await getUserData(twitterHandle, fName);
    const cast = `@farcaster_directory Verifying my Farcaster account. Farcaster: \"${fName}\" Twitter: \"${twitterHandle}\"`;
    const castHash = castLink.slice(85,);
    const castCheckRes = await fetch(`https://api.farcaster.xyz/v2/cast?hash=${castHash}`, {
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${env.FC_APPLICATION_BEARER_TOKEN}`
      }
    });
    const castCheck = await castCheckRes.json();
    const castText: string = castCheck.result.cast.text;
    const castTimestamp: Date = new Date(castCheck.result.timestamp);
  
    if (cast != castText) return 'Cast text does not match format';
  
    return {
      user,
      cast: {
        castLink,
        castText,
        castTimestamp
      }
    }
  } catch (e) {
    console.log('ERROR in verifyOnFarcaster in verify.ts:\n', e)
    return 'Unable to verify';
  }
}
