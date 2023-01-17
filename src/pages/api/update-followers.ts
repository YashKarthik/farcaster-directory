import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "../../server/api/root";
import { createTRPCContext } from "../../server/api/trpc";
import Cors from 'cors'

const cors = Cors({
  methods: "GET"
});

const corsMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (
    req: NextApiRequest,
    res: NextApiResponse,
    result: any
  ) => void
) => {
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

  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  try {
    const updateRes = await caller.verify.updateFollowers();
    console.log(updateRes);
    return res.status(200).json({ message: "somthing" });
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }
    // Another error occured
    console.error(cause);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default fetchByFID;
