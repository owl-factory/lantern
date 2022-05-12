export type AccessFunction<T> = (doc: any) => T
export type AccessFieldValue<T> = T | AccessFunction<T>


export interface LogicDescriptor {
  collection: string;
  dynamicAccess?: (doc: any) => string | undefined;
  staticAccess?: () => string;
  requireLogin?: boolean;
  fetch?: (ref: string) => Promise<any>;
  validation?: (doc: any) => string[] | undefined;
  role?: string;
  parent?: any;
  readFields: AccessFieldValue<string[]>;
  setFields?: AccessFieldValue<string[]>;
  value: any;
}
