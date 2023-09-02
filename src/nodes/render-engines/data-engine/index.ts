import { Scalar } from "types";

export interface DataEngineAPI {
  load: (id: string, referrer: string) => DataAPI;
  free: (id: string, referrer: string) => boolean;
}

type FieldPath = string | (string | number)[];
export interface DataAPI {
  // Gets some nested information from this particular piece of data
  get(path: FieldPath): unknown | undefined;
  // Sets information within this particular piece of data
  set(path: FieldPath, data: Scalar): boolean;
  // Refreshes the data from the database (source of truth)
  refresh(): void;
  // Flushes the changes to the database (source of truth)
  flush(): void;
}
