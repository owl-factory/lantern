
// TODO - this whole file needs some serious work to handle the discrepencies between raw Fauna
// and processed fauna results.
export interface ReceievedFaunaRef {
  "@ref": FaunaRef;
}

/**
 * A standard Fauna reference object
 * TODO - can we add class helpers to this? EG id() to fetch the ID?
 */
 export interface FaunaRef {
  id?: string;
  value: {
    id: string;
    collection?: FaunaRef | ReceievedFaunaRef;
  }
}

/**
 * A raw Fauna document recieved from FaunaDB
 */
export interface FaunaDocument<T> {
  ref?: FaunaRef;
  data?: T;
  ts?: number;
}

/**
 * Represents a response from running a search using Fauna indexes
 */
export interface FaunaIndexResponse {
  data?: (string | number | unknown)[][];
  error?: any;
}

export interface FaunaIndexOptions {
  size: number;
}

// A single item of a document returned from a Fauna index search
export type FaunaIndexResponseItem = (string | number | unknown);
// A single document of items returned from a Fauna index search
export type FaunaIndexResponseDocument = FaunaIndexResponseItem[];
