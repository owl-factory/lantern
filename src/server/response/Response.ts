import { NextApiRequest, NextApiResponse } from "next";
import { databaseSetup } from "../../utilities/mongo";

type RequestFunction = (req: NextApiRequest, res: NextApiResponse) => void;
type PossibleMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class HTTPHandler {
  public GET?: RequestFunction;
  public POST?: RequestFunction;
  public PUT?: RequestFunction;
  public PATCH?: RequestFunction;
  public DELETE?: RequestFunction;

  private req: NextApiRequest;
  private res: NextApiResponse;

  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.req = req;
    this.res = res;
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

    } catch (e) {
      responseJson.message = `An unexpected error occured. If this continues occuring,
        please contact our staff!`;
    }
  }

  protected returnSuccess(data: Record<string, unknown>): void {
    const responseBody = {
      success: true,
      data: data,
      message: "",
    };
    this.res.status(200).json(responseBody);
  }

  protected returnError(code: number, message: string): void {
    const responseBody = {
      success: true,
      data: {},
      message,
    };
    this.res.status(code).json(responseBody);
  }
}
export default HTTPHandler;
