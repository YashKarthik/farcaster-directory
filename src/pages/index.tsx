import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "../utils/api";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Farcaster Directory</title>
        <meta name="description" content="Find your Twitter friends on Farcaster." />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="text-white flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">

          <div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
              <span className="text-[hsl(280,100%,70%)]">Farcaster Directory</span>
            </h1>
            <p className="mt-1 text-2xl font-medium tracking-tight">
              Find your Twitter friends on Farcaster!
            </p>

          </div>

          <div className="flex flex-col items-center justify-start">
            <p className="mt-5 mb-10 text-xl"> 
              Add your Farcaster account to the directory so your followers 
              can easily find you.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
              <Link href="/twitter" className="bg-blue-500 font-bold rounded-md p-5 hover:bg-blue-400">
                Verify on Twitter
              </Link>

              <Link href="/farcaster" className="bg-purple-500 font-bold rounded-md p-5 hover:bg-purple-400">
                Verify on Farcaster
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
