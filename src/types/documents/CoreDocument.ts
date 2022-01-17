import { Ref64 } from "@owl-factory/types";

export interface CoreDocument {
  ref: Ref64;
  ts?: number;

  name?: string;
  ownedBy?: { ref: Ref64; };
  createdAt?: Date;
  createdBy?: { ref: Ref64; };
  updatedAt?: Date;
  updatedBy?: { ref: Ref64; };
}

