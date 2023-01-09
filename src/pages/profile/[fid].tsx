import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from 'zod';

import { api } from "../../utils/api";

const Home: NextPage = () => {

  const nextRouter = useRouter();
  const [ fid, setFid ] = useState(0);
  const CheckFIDFormat = z.coerce.number();

  useEffect(() => {
    if (nextRouter.isReady) {
      const { fid } = nextRouter.query;
      try {
        const FID = CheckFIDFormat.parse(fid);
        setFid(FID);
      } catch {
        nextRouter.push('/')
      }
    }
  }, [nextRouter.isReady]);

  const queryBasicData = api.fetchData.fetchUser.useQuery({ fid: fid});

  return (
    <>
      <Head>
        <title>Farcaster Directory / Profile</title>
        <meta name="description" content="User profile for fid." />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="text-white flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c]">

        <Link href="/" className="flex flex-col self-start m-4">
          <h1 className="text-xl font-extrabold tracking-tight">
            <span className="text-[hsl(280,100%,70%)]">Farcaster Directory</span>
          </h1>
          <p className="mt-1 text-md font-medium tracking-tight">
            Farcaster profile for {fid}
          </p>
        </Link>

        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          {queryBasicData.isLoading && <p>Fetching user profile</p>}
          {queryBasicData.isError && <p>Error while fetching user profile: {queryBasicData.error.message}</p>}
          {queryBasicData.isSuccess && (
            queryBasicData.data[0]?.twitter_username || queryBasicData.data[0]?.cast_timestamp ? (
            <div>
              <div className="flex flex-row gap-1">
                <p className="font-semibold text-purple-400">Farcaster name (FNAME):</p>
                <p>{queryBasicData.data[0]?.fname}</p>
              </div>
              <div className="flex flex-row gap-1">
                <p className="font-semibold text-purple-400">Farcaster ID (FId):</p>
                <p>{queryBasicData.data[0]?.fid}</p>
              </div>
              <div className="flex flex-row gap-1">
                <p className="font-semibold text-purple-400">Twitter useranme:</p>
                <p>{queryBasicData.data[0]?.twitter_username}</p>
              </div>
              <div className="flex flex-row gap-1">
                <p className="font-semibold text-purple-400">Custody address:</p>
                <p className="font-mono">{queryBasicData.data[0]?.custody_address}</p>
              </div>
              <div className="flex flex-row gap-1">
                <p className="font-semibold text-purple-400">Connected address:</p>
                <p className="font-mono">{queryBasicData.data[0]?.connected_address}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                {queryBasicData.data[0]?.cast_timestamp ? (
                  <div className="max-w-[35ch]">
                    <p className="mt-5 mb-1">Verification cast:</p>
                    <p className="p-2 border-solid border-2 border-purple-500 rounded-sm">
                      {queryBasicData.data[0].cast_content}
                    </p>
                    <a 
                      className="mt-3 text-purple-400"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://phrasetown.com/cast/${queryBasicData.data[0].cast_link!.slice(85,)}`}
                    >
                      View cast in Phrasetown
                    </a>
                  </div>
                ):(
                  <div>
                    User has not reverse-verified their Twitter username.
                  </div>
                )}

                {queryBasicData.data[0]?.tweet_timestamp ? (
                  <div className="max-w-[35ch]">
                    <p className="mt-5 mb-1">Verification tweet:</p>
                    <p className="p-2 border-solid border-2 border-purple-500 rounded-sm">
                      {queryBasicData.data[0].tweet_content}
                    </p>
                    <a 
                      className="mt-3 text-purple-400"
                      target="_blank"
                      rel="noreferrer"
                      href={queryBasicData.data[0].tweet_link as string}
                    >
                      View verification Tweet
                    </a>
                  </div>
                ):(
                  <div>
                    User has not verified their Farcaster username.
                  </div>
                )}
              </div>
            </div>
            ):(
              <p>User with FID {fid} not registered</p>
            ))}
        </div>
      </main>
    </>
  );
};

export default Home;
