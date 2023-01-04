import { createTRPCRouter } from "./trpc";
import { example2Router } from "./routers/example2";
import { supabaseRouter } from './routers/database';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  verify: supabaseRouter,
  example2: example2Router,
});

// export type definition of API
export type AppRouter = typeof appRouter;
