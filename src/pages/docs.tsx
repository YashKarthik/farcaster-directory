import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const DocsPage: NextPage = () => {

  return (
    <>
      <Head>
        <title>Farcaster Directory Docs</title>
        <link rel="icon" href="/favicon.svg" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="description" content="API Docs for Farcaster Directory" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <meta name="robots" content="all" />
        <meta name="og:title" content="Farcaster Directory Docs" />
        <meta name="og:description" content="API Docs for Farcaster Directory" />
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
                &nbsp; cast_timestamp:    string|null; <br/>
                &nbsp; tweet_timestamp:   Date; <br/>
                &nbsp; cast_content:      string|null; <br/>
                &nbsp; tweet_content:     string|null; <br/>
                &nbsp; cast_link:         string|null; <br/>
                &nbsp; tweet_link:        string|null; <br/>
              {'}'}[]
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

            <hr/>

            <p>
              - Either the cast params (timestamp, content, link) or the tweet params may be null, but not both.
            </p>
            <p>
              - The `id` has no meaning with repect to the protocol, it&quot;s just the database primary key.
            </p>
            <p>
              - Unique properties? None of the props are unique to a single row. The same FID may be &quot;owned&quot; by different twitter users, and vice versa. Hence the array response.
            </p>
            <p>
              - Create an <a className="text-purple-400" target="_blank" rel="noreferrer" href="https://github.com/yashkarthik/farcaster-directory">issue</a> if you need other endpoints.
            </p>

          </div>
        </div>
      </main>
    </>
  );
}

export default DocsPage;
