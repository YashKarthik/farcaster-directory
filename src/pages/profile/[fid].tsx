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
        <title>{fid}&lsquo; in Farcaster Directory</title>
        <meta name="description" content={"Farcaster Directory profile for fid:" + fid} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="description" content={"Farcaster Directory profile for fid:" + fid}/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <meta name="robots" content="all" />
        <meta name="og:title" content="Farcaster Directory" />
        <meta name="og:description" content={"Farcaster Directory profile for fid:" + fid}/>
        <meta name="og:type" content="profile" />
        <meta name="og:image" content="https://directory.yashkarthik.xyz/ogImage.png" />
        <meta name="og:url" content="https://directory.yashkarthik.xyz" />
        <meta name="twitter:site" content="@_yashKarthik" />
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
                <button onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(queryBasicData.data[0]!.custody_address!);
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 text-purple-400 mb-1 w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                  </svg>
                </button>

              </div>
              <div className="flex flex-row gap-1">
                <p className="font-semibold text-purple-400">Connected address:</p>
                <p className="font-mono">{queryBasicData.data[0]?.connected_address}</p>
                <button onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(queryBasicData.data[0]!.connected_address[0]!);
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 text-purple-400 mb-1 w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                  </svg>
                </button>
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
                      href={`https://www.discove.xyz/threads/${queryBasicData.data[0].cast_link!.slice(85,)}/${queryBasicData.data[0].cast_link!.slice(85,)}/`}
                    >
                      View cast in Discove.xyz
                    </a>
                  </div>
                ):(
                  <div className="max-w-[35ch] opacity-70">
                    <p className="mt-5 mb-1">Verification cast:</p>
                    <p className="p-2 border-solid border-2 border-purple-600 rounded-sm">
                      User has not reverse-verified their Twitter username from Farcaster.
                    </p>
                    <a 
                      className="mt-3 text-purple-400 pointer-events-none"
                    >
                      View cast in Discove.xyz
                    </a>
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
                  <div className="max-w-[35ch] opacity-70">
                    <p className="mt-5 mb-1">Verification tweet:</p>
                    <p className="p-2 border-solid border-2 border-purple-600 rounded-sm">
                      User has not verified their Farcaster username from Twitter.
                    </p>
                    <a 
                      className="mt-3 text-purple-400 pointer-events-none"
                    >
                      View verification tweet
                    </a>
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
