
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

export interface FaunaDocument<T> {
  ref?: FaunaRef;
  data?: T;
  ts?: number;
}
