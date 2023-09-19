import { XMLElementAPI } from "./XMLElementAPI";

export interface XMLEngineAPI {
  // Gets an array of XMLElements that define the layout
  getLayout: () => XMLElementAPI[];

  // Gets a key unique to this instance
  getKey: () => string;
}

export class NullXMLEngineAPI implements XMLEngineAPI {
  public getLayout(): XMLElementAPI[] { return []; }
  public getKey() { return "null-key"; }
}
