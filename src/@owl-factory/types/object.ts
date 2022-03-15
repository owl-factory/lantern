import { Ref64 } from ".";

// TODO - move to API? Better define? Comment!
export type ResponseDoc<T> = Partial<T> | Error;

export interface CrudPacket<T> {
  success: boolean;
  ref?: Ref64;
  doc?: T;
  messages?: string[]; // A list of messages or errors
  key?: string; // A non-ref key for linking actions that do not have a ref related, such as create events
}
