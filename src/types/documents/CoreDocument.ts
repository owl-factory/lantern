import { Ref64 } from "@owl-factory/types";

export interface CoreDocument {
  ref: Ref64;
  name: string;
  _v: string;

  ownedBy: { ref: Ref64; };
  createdAt: Date;
  createdBy: { ref: Ref64; };
  updatedAt: Date;
  updatedBy: { ref: Ref64; };
}

