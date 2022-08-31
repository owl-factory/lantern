import { ConversionMap } from "@owl-factory/database/postgres";
import type { Ref64, UUID } from "@owl-factory/types";
import { DataType } from "ts-postgres";
import { BaseDocument, BaseDocumentV2 } from "./BaseDocument";


export interface ActorSheetDocument extends BaseDocument {
  ruleset: {
    ref: Ref64; // The ref for the ruleset this actor sheet uses
  }
  xml: string; // The raw XML used to build the page
}

// The second generation actor sheet for Postgres documents
export interface ActorSheetDocumentV2 extends BaseDocumentV2 {
  id: UUID; // The primary key of the actor sheet document
  name: string; // The name of the actor sheet document
  owned_by: UUID; // The creator and owner of the actor sheet document
  ruleset_id: UUID; // The ruleset that this actor sheet is for
  xml: string; // The raw XML that defines the structure of the actor sheet render
}

// The conversion between the actor sheet
export const ActorSheetConversionMap: ConversionMap<ActorSheetDocumentV2> = {
  id: DataType.Uuid,
  name: DataType.Text,
  ruleset_id: DataType.Uuid,
  xml: DataType.Text,
};

