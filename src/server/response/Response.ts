import { NextApiRequest, NextApiResponse } from "next";
import { databaseSetup } from "../../utilities/mongo";
import { Session } from "next-auth";

type RequestFunction = (req: NextApiRequest, res: NextApiResponse) => void;
type PossibleMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface Context {
  req: NextApiRequest;
  res: NextApiResponse;
  session: Session | null;
}

export class HTTPHandler {
  public GET?: RequestFunction;
  public POST?: RequestFunction;
  public PUT?: RequestFunction;
  public PATCH?: RequestFunction;
  public DELETE?: RequestFunction;

  private req: NextApiRequest;
  private res: NextApiResponse;
  public ctx: Context;

  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.req = req;
    this.res = res;
    this.ctx = { req, res, session: null };
  }

  public async handle(): Promise<void> {
    const responseJson = {
      content: {},
      message: "",
      success: false,
    };

    try {
      // Handles initializing the database
      // TODO - ensure that we can access the user DB 
      //  seperately with or without disconnecting
      databaseSetup();

      // Checks that this method is present
      const method = this.req.method as PossibleMethods;
      if (this[method] === undefined) {
        responseJson.message = `The method ${method} does not exist for this endpoint.`;
        this.res.status(405).json(responseJson);
        return;
      }

      await (this[method] as RequestFunction)(this.req, this.res);

    } catch (error) {
      if (error.code && error.message) {
        this.returnError(
          error.code,
          error.message
        );
      } else {
        this.returnError(
          500,
          `An unexpected error occured. If this continues occuring, please contact our staff!`
        );
      }
    }
  }

  public returnSuccess(data: Record<string, unknown>): void {
    const responseBody = {
      success: true,
      data: data,
      message: "",
    };
    this.res.status(200).json(responseBody);
  }

  public returnError(code: number, message: string): void {
    const responseBody = {
      success: false,
      data: {},
      message,
    };
    this.res.status(code).json(responseBody);
  }
}
export default HTTPHandler;
