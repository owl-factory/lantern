import type { Ref64, UUID } from "@owl-factory/types";
import { DataType } from "ts-postgres";

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

export interface BaseDocumentV2 {
  id: UUID;

  owned_by: UUID;
  created_at: Date;
  created_by: UUID;
  updated_at: Date;
  updated_by: UUID;
  deleted_at: Date;
  deleted_by: UUID;
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


export const BaseDocumentConversionMap: Record<keyof BaseDocumentV2, DataType> = {
  id: DataType.Uuid,
  owned_by: DataType.Uuid,
  created_at: DataType.Timestamp,
  created_by: DataType.Uuid,
  updated_at: DataType.Timestamp,
  updated_by: DataType.Uuid,
  deleted_at: DataType.Timestamp,
  deleted_by: DataType.Uuid,
};
