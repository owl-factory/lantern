import { Ref64 } from "types";

export interface BaseDocument {
  ref: Ref64;
  name: string;
  _v: string;

  ownedBy: { ref: Ref64 | null; };
  createdAt: Date;
  createdBy: { ref: Ref64 | null; };
  updatedAt: Date;
  updatedBy: { ref: Ref64 | null; };
}

export const baseDocument = {
  ref: "",
  name: "",
  _v: "0.0.0",

  ownedBy: { ref: "" },
  createdAt: new Date(),
  createdBy: { ref: "" },
  updatedAt: new Date(),
  updatedBy: { ref: "" },
};
