import { NextApiRequest, NextApiResponse, NextPageContext } from "next/types";

export type NextContext = ({res: NextApiResponse<any>, req: NextApiRequest });
