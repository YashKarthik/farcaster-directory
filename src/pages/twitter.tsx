import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

import { api } from "../utils/api";

const TwitterVerifyPage: NextPage = () => {

  const [ twitterHandle, setTwitterHandle ] = useState('');
  const [ fname, setFname ] = useState('');

  return (
    <>
      <Head>
        <title>Farcaster Directory / Twitter</title>
        <meta name="description" content="Announce and verify your Farcaster account on Twitter" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="text-white flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c]">

        <Link href="/" className="flex flex-col self-start m-4">
          <h1 className="text-xl font-extrabold tracking-tight">
            <span className="text-[hsl(280,100%,70%)]">Farcaster Directory</span>
          </h1>
          <p className="mt-1 text-md font-medium tracking-tight">
            Verify your Farcaster account from Twitter
          </p>
        </Link>

        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">

          <form className="flex flex-col gap-2">
            <div className="flex flex-row justify-between max-w-md">
              <p>Twitter username: </p>
              <input 
                type="text"
                placeholder="_yashkarthik" 
                onChange={e => setTwitterHandle(e.target.value)} 
                className="mx-3 px-1 bg-inherit border-solid border-2 border-purple-500 rounded-sm"
              />
            </div>

            <div className="flex flex-row justify-between max-w-md">
              <p>Farcaster username: </p>
              <input 
                type="text"
                placeholder="yashkarthik" 
                onChange={e => setFname(e.target.value)} 
                className="mx-3 px-1 bg-inherit border-solid border-2 border-purple-500 rounded-sm"
              />
            </div>

            <div className="my-5 max-w-md">
              <p className="font-semibold my-3">
                Copy and tweet the following text:
              </p>
              <p className="my-3 p-2 max-w-sm border-solid border-2 rounded-sm border-purple-500 whitespace-normal">
                @fc_directory Verifying my Farcaster account. Farcaster: "{fname}" Twitter: "{twitterHandle}"
              </p>
              <button 
                className="bg-purple-500 font-bold rounded-sm p-1 hover:bg-purple-400"
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(`@fc_directory Verifying my Farcaster account. Farcaster: \"${fname}\" Twitter: \"${twitterHandle}\"`);
                }}
              >
                Copy
              </button>

              <p className="font-semibold my-5 ">
                After tweeting, press the verify button so I can go check the tweet.
              </p>

              <button 
                className="bg-purple-500 font-bold rounded-sm p-1 hover:bg-purple-400"
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(`@fc_directory Verifying my Farcaster account. Farcaster: \"${fname}\" Twitter: \"${twitterHandle}\"`);
                }}
              >
                Verify Tweet
              </button>

            </div>
          </form>

        </div>
      </main>
    </>
  );
};

export default TwitterVerifyPage;
