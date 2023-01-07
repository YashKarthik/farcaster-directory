import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import Coffee from '../../public/coffee.png';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { api } from "../utils/api";

const Home: NextPage = () => {
  
  const queryBasicData = api.fetchData.fetchBasicData.useQuery();
  const numUsers = api.fetchData.fetchCount.useQuery();
  const data = queryBasicData.data;

  type User = {
    fid: number;
    fname: string;
    twitter_username: string;
    cast_timestamp: string|undefined;
    tweet_timestamp?: string|undefined;
  }
  const columnHelper = createColumnHelper<User>();
  const columns = [
    columnHelper.accessor("fname", {
      cell: (info) => info.getValue(),
      header: () => <span>Farcaster Username</span>,
    }),
    columnHelper.accessor("fid", {
      cell: (info) => info.getValue(),
      header: () => <span>Farcaster ID</span>,
    }),
    columnHelper.accessor("twitter_username", {
      cell: (info) => info.getValue(),
      header: () => <span>Twitter Username</span>,
    }),
    columnHelper.accessor("cast_timestamp", {
      cell: (info) => info.row.getValue('cast_timestamp') ? 'Verified' : 'Unverified',
      header: () => <span>Verified from Farcaster?</span>,
    }),
    columnHelper.accessor("tweet_timestamp", {
      cell: (info) => info.row.getValue('tweet_timestamp') ? 'Verified' : 'Unverified',
      header: () => <span>Verified from Twitter?</span>,
    }),
    columnHelper.accessor("fid", {
      cell: (info) => <Link href={"/profile/" + info.getValue()}>Open Profile</Link>,
      header: () => <span>Profile</span>,
    }),
  ];

  const table = useReactTable({
    // @ts-expect-error: Data maybe undefined
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <Head>
        <title>Farcaster Directory</title>
        <meta
          name="description"
          content="Find your Twitter friends on Farcaster."
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
              <span className="text-[hsl(280,100%,70%)]">
                Farcaster Directory
              </span>
            </h1>
            <p className="mt-1 text-2xl font-medium tracking-tight">
              Find your Twitter friends on Farcaster!
            </p>
          </div>

          <div className="flex flex-col items-center justify-start">
            <p className="mt-5 mb-10 text-xl">
              Add your Farcaster account to the directory so your followers can
              easily find you.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
              <Link
                href="/twitter"
                className="rounded-md bg-blue-500 p-5 font-bold hover:bg-blue-400"
              >
                Verify on Twitter
              </Link>
              <Link
                href="/farcaster"
                className="rounded-md bg-purple-500 p-5 font-bold hover:bg-purple-400"
              >
                Verify on Farcaster
              </Link>
            </div>

            <div className="mt-14">
              
              {numUsers.isError && <p>Error fetching number of users </p>}
              {numUsers.isLoading && <p>Fetching number of users</p>}
              {queryBasicData.isError && <p>Error while fetching database </p>}
              {queryBasicData.isLoading && <p>Fetching database...</p>}

              {numUsers.isSuccess && ( 
                typeof numUsers.data != "number" || numUsers.data == 0 ? (
                  <p>No users registered yet.</p>
                ):(
                  queryBasicData.isSuccess && (
                    <>
                      <p>List of {numUsers.data} users that connected their Farcaster account with Twitter:</p>
                      <table className="table-auto mt-5 p-5 border-2 border-solid border-purple-500 border-collapse">
                        <thead>
                          {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-solid border-purple-500 border-b-2">
                              {headerGroup.headers.map((header) => (
                                <th key={header.id} className="p-3 border-solid border-purple-400 border-opacity-50 border-x-2">
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody>
                          {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="border-solid border-purple-500 border-b-2">
                              {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="p-2 border-solid border-purple-400 border-opacity-50 border-x-2">
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          {table.getFooterGroups().map((footerGroup) => (
                            <tr key={footerGroup.id}>
                              {footerGroup.headers.map((header) => (
                                <th key={header.id}>
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.footer,
                                        header.getContext()
                                      )}
                                </th>
                              ))}
                            </tr>
                          ))}
                        </tfoot>
                      </table>
                    </>
                  )
                )
              )}
            </div>
          </div>
        </div>
        <footer className="mb-0 items-center p-4 mt-40 border-t-2 border-dashed border-slate-300 grid grid-cols-3 gap-7 md:place-self-center md:justify-self-end">
          <a className="font-mono" href="farcaster://profiles/1600">
            yashkarthik
          </a>

          <a
            className="font-mono" 
            href="https://github.com/yashkarthik/skimmr"
            target="_blank"
          >
            GitHub
          </a>

          <a
            href="https://www.buymeacoffee.com/yashkarthik" 
            target="_blank"
            className="border-2 rounded-md border-white max-w-[10ch]"
          >
            <Image 
              src={Coffee}
              alt="Buy me a coffee button" 
              width="100" 
              height="100"
            />
          </a>

        </footer>
      </main>
    </>
  );
};

export default Home;
