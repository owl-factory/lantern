import { NextApiRequest } from "next/types";
import HTTPHandler from "../controllers/HttpHandler";

// Describes an object containing the functions to run for a specific HTTP REST method
// These functions will be run on reaching the endpoint and appropriate method
export interface CreateEndpointOptions {
  GET?: (this: HTTPHandler, req: NextApiRequest) => Promise<void>;
  POST?: (this: HTTPHandler, req: NextApiRequest) => Promise<void>;
  PUT?: (this: HTTPHandler, req: NextApiRequest) => Promise<void>;
  PATCH?: (this: HTTPHandler, req: NextApiRequest) => Promise<void>;
  DELETE?: (this: HTTPHandler, req: NextApiRequest) => Promise<void>;
}
