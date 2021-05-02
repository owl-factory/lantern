import { Ref } from "types/user";

export class CoreDocument {
  _doc?: unknown;

  ref?: Ref;

  name?: string;

  alias?: string;

  ownedBy?: Ref;

  createdBy?: string;

  createdAt?: Date;

  updatedBy?: string;

  updatedAt?: Date;

  deletedBy?: string;

  deletedAt?: Date;
}
