import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const DocsPage: NextPage = () => {

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
            API docs for interacting with the directory.
          </p>
        </Link>

        <div className="container flex flex-col items-start justify-start gap-5 px-4 py-16 ">
          <div className="flex flex-row gap-2">
            <p className="font-semibold text-purple-400">Endpoint url:</p>
            <p className="font-mono">directory.yashkarthik.xyz/api/read-user/:fid</p>
          </div>
          <p>Where FID is the user&apos;s fid</p>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-purple-400">Response shape:</p>
            <p className="text-purple-400">Response for valid input:</p>
            <div className="font-mono ml-3">
              {'{'} <br/>
                &nbsp; id:                number; <br/>
                &nbsp; fid:               number; <br/>
                &nbsp; fname:             string; <br/>
                &nbsp; twitter_username:  string; <br/>
                &nbsp; custody_address:   string; <br/>
                &nbsp; connected_address: string[]; <br/>
                &nbsp; cast_timestamp:    null; <br/>
                &nbsp; tweet_timestamp:   Date; <br/>
                &nbsp; cast_content:      null; <br/>
                &nbsp; tweet_content:     string; <br/>
                &nbsp; cast_link:         null; <br/>
                &nbsp; tweet_link:        string; <br/>
              {'}'}
            </div>

            <p className="text-purple-400">Possible responses when error:</p>
            <div className="font-mono ml-3">
              {'{'} <br/> &nbsp; message: &apos;User FID not registered.&apos; <br/> {'}'}
              <hr className="my-3 border-gray-700"/>
              {'{'} <br/> &nbsp; message: &apos;Internal server error&apos; <br/> {'}'}
              <hr className="my-3 border-gray-700"/>
              {'{'} <br/>
                &nbsp; &quot;issues&quot;: [ <br/>
                &nbsp; {'{'} <br/>
                    &nbsp;&nbsp; &quot;code&quot;: &quot;invalid_type&quot;, <br/>
                    &nbsp;&nbsp; &quot;expected&quot;: &quot;number&quot;, <br/>
                    &nbsp;&nbsp; &quot;received&quot;: &quot;nan&quot;, <br/>
                    &nbsp;&nbsp; &quot;path&quot;: [], <br/>
                    &nbsp;&nbsp; &quot;message&quot;: &quot;Expected number, received nan&quot; <br/>
                &nbsp; {'}'} <br/>
                &nbsp; ], <br/>
                &nbsp; &quot;name&quot;: &quot;ZodError&quot; <br/>
              {'}'}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default DocsPage;
