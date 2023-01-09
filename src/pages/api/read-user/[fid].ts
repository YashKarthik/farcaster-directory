import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "../../../server/api/root";
import { createTRPCContext } from "../../../server/api/trpc";
import { z, ZodError } from 'zod';

const fetchByFID = async (req: NextApiRequest, res: NextApiResponse) => {
  const { fid } = req.query;
  const CheckFIDFormat = z.coerce.number();

  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  try {
    const FID = CheckFIDFormat.parse(fid);
    const user = await caller.fetchData.fetchUser({fid: FID})
    if (user.length == 0) res.status(404).json({ message: 'User FID not registered'});
    else res.status(200).json(user);
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }
    else if (cause instanceof ZodError) {
      return res.status(406).json(cause);
    }
    // Another error occured
    console.error(cause);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default fetchByFID;
