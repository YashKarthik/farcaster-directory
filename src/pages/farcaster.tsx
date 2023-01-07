import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { z } from 'zod';
import { api } from "../utils/api";

const FarcasterVerifyPage: NextPage = () => {

  const castVerificationMutation = api.verify.verifyCast.useMutation();
  const [ twitterHandle, setTwitterHandle ] = useState('');
  const [ fname, setFname ] = useState('');
  const [ castLink, setCastLink ] = useState('');
  const [ lengthErr, setLengthErr ] = useState('');

  const checkUsernames = z.string({
    required_error: "Username is required",
  }).min(1)

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
            Reverse-verify your Twitter account from Farcaster.
          </p>
        </Link>

        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">

          <form className="flex flex-col gap-2">
            <div className="flex md:flex-row flex-col justify-between md:max-w-md max-w-fit">
              <p>Twitter username: </p>
              <input 
                type="text"
                placeholder="_yashkarthik" 
                onChange={e => { setTwitterHandle(e.target.value); setLengthErr('')}} 
                className="mx-3 px-1 bg-inherit border-solid border-2 border-purple-500 rounded-sm"
              />
            </div>

            <div className="flex md:flex-row flex-col justify-between md:max-w-md max-w-fit">
              <p>Farcaster username: </p>
              <input 
                type="text"
                placeholder="yashkarthik" 
                onChange={e => { setFname(e.target.value); setLengthErr('')}} 
                className="mx-3 px-1 bg-inherit border-solid border-2 border-purple-500 rounded-sm"
              />
            </div>

            <div className="my-5 max-w-md">
              <p className="font-semibold my-3">
                Copy and cast the following text:
              </p>
              <p className="my-3 p-2 max-w-sm border-solid border-2 rounded-sm border-purple-500 whitespace-normal">
                @directory Verifying my Farcaster account. Farcaster: &quot;{fname}&quot; Twitter: &quot;{twitterHandle}&quot;
              </p>
              <button 
                className="bg-purple-500 font-bold rounded-sm p-1 hover:bg-purple-400"
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(`@directory Verifying my Farcaster account. Farcaster: \"${fname}\" Twitter: \"${twitterHandle}\"`);
                }}
              >
                Copy
              </button>

              <p className="font-semibold my-5 ">
                After casting, paste the cast link and press the verify button so I can go check the cast.
              </p>

              <div >
                <input 
                  type="url"
                  placeholder="farcaster://casts/0x282591aadcef882bfc93a81879d86e10efc1f7d324a4c9b1dd1f4c676be5f61b/0x282591aadcef882bfc93a81879d86e10efc1f7d324a4c9b1dd1f4c676be5f61b" 
                  onChange={e => { setCastLink(e.target.value); setLengthErr('')}} 
                  className="my-3 mr-2 max-w-md min-w-[20ch] px-1 bg-inherit border-solid border-2 border-purple-500 rounded-sm"
                />
                <button 
                  className="bg-purple-500 font-bold rounded-sm p-1 hover:bg-purple-400"
                  onClick={(e) => {
                    e.preventDefault();
                    if (checkUsernames.safeParse(twitterHandle).success && checkUsernames.safeParse(fname).success) {
                      castVerificationMutation.mutate({
                        twitterHandle: twitterHandle,
                        fName: fname,
                        castLink: castLink
                      });
                    } else {
                      setLengthErr('Twitter username or Farcaster username or Cast link missing');
                    }
                  }}
                >
                  Verify Cast
                </button>
              </div>

              <div className="my-5 ">
                {lengthErr != '' && (<p className="bg-red-500 bg-opacity-50 p-1 rounded-sm">Error: {lengthErr}</p>)}
                {castVerificationMutation.isLoading && (
                  <p>Checking for verification cast...</p>
                )}
                
                {castVerificationMutation.isError && (
                  <p className="bg-red-500 bg-opacity-50 p-1 rounded-sm">Error: {castVerificationMutation.error.message}</p>
                )}

                {castVerificationMutation.isSuccess && (
                  <p className="bg-green-500 bg-opacity-50 p-1 rounded-sm">Done: {castVerificationMutation.data} </p>
                )}

              </div>

            </div>
          </form>

        </div>
      </main>
    </>
  );
};

export default FarcasterVerifyPage;
