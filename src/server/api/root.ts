import { createTRPCRouter } from "./trpc";
import { supabaseWriteRouter } from './routers/writeDB';
import { supabaseReadRouter } from './routers/readDB';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  verify: supabaseWriteRouter,
  fetchData: supabaseReadRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
