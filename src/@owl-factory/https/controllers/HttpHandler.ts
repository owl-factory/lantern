import { initializeNextContext } from "@owl-factory/next";
import { Auth } from "controllers/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { Context } from "types/server";

type RequestFunction = (req: NextApiRequest, res: NextApiResponse) => void;
type PossibleMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
// An enum describing the different supported types that may be returned from the API
export enum HttpHandlerReturnType {
  JSON="json",
  XML="xml",
}

export class HTTPHandler {
  public GET?: RequestFunction;
  public POST?: RequestFunction;
  public PUT?: RequestFunction;
  public PATCH?: RequestFunction;
  public DELETE?: RequestFunction;

  // The return type that the Handler will use
  public returnFormat = HttpHandlerReturnType.JSON;

  private req: NextApiRequest;
  private res: NextApiResponse;
  public ctx: Context;

  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.req = req;
    this.res = res;
    this.ctx = { req, res };
  }

  public async handle(): Promise<void> {
    const responseJson = {
      content: {},
      message: "",
      success: false,
    };

    try {
      initializeNextContext({ req: this.req, res: this.res });

      Auth.fromReq(this.req);

      // Checks that this method is present
      const method = this.req.method as PossibleMethods;
      if (this[method] === undefined) {
        responseJson.message = `The method ${method} does not exist for this endpoint.`;
        this.res.status(405).json(responseJson);
        return;
      }

      await (this[method] as RequestFunction)(this.req, this.res);

    } catch (error: any) {
      if (error.code && error.message) {
        this.returnError(
          error.code,
          error.message
        );
      } else {
        console.error(error);
        this.returnError(
          500,
          `An unexpected error occured. If this continues occuring, please contact our staff!`
        );
      }
    }
  }

  public returnSuccess(data: Record<string, unknown> | string): void {
    const responseBody = {
      success: true,
      data: data,
      message: "",
    };
    switch(this.returnFormat) {
      default:
        console.warn(`The return method '${this.returnFormat}' is not a valid format within the HTTPHandler.`);
      // eslint-disable-next-line no-fallthrough
      case "json":
        this.res.status(200).json(responseBody);
        break;
      case "xml":
        this.res.status(200).setHeader("Content-Type", "application/xml").send(data);
        break;

    }
  }

  public returnError(code: number, message: unknown): void {
    const responseBody = {
      success: false,
      data: { error: message },
      message: JSON.stringify(message), // TODO - remove
    };
    this.res.status(code).json(responseBody);
  }
}
export default HTTPHandler;
