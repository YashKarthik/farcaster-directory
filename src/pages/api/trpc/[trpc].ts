import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path}: ${error}`);
        }
      : undefined,
});


/**
* @example Exposing a single TRPC api to others
* */

// export default async function exampleAPI(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const ctx = await createTRPCContext({ req , res});
//   const caller = appRouter.createCaller(ctx);
// 
//   try {
//     const hello = await caller.example2.hello({ name: 'Yash', from: 'India', birthdate: new Date()})
//     console.log('Form [trpc].ts' + hello);
//     res.status(200).json(hello);
//   } catch (e) {
//     console.log("ERROR in custom API" + e);
//     res.status(500).json({message: 'error'})
//   }
// }
