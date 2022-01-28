import { NextApiRequest, NextApiResponse, NextPageContext } from "next/types";

export type NextContext = ({res: NextApiResponse<any>, req: NextApiRequest });
export type CtxReq = Pick<NextPageContext, "req"> | {req: NextApiRequest;} | null | undefined;
export type CtxRes = Pick<NextPageContext, "res"> | {res: NextApiResponse<any>;} | null | undefined;
