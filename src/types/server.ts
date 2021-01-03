import { IncomingMessage, ServerResponse } from "http";

export interface Context {
  session: unknown;
  req: IncomingMessage;
  res: ServerResponse;
}
