import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "../../../server/api/root";
import { createTRPCContext } from "../../../server/api/trpc";
import { z, ZodError } from 'zod';
import Cors from 'cors'

const cors = Cors({
  methods: "GET"
});

const corsMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    });
  });
}

const fetchByFID = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res, cors);

  const { fid } = req.query;
  const CheckFIDFormat = z.coerce.number();

  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  try {
    const FID = CheckFIDFormat.parse(fid);
    const user = await caller.fetchData.fetchUser({fid: FID})
    if (user.length == 0) return res.status(404).json({ message: 'User FID not registered'});
    return res.status(200).json(user[0]);
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default fetchByFID;
