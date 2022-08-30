import { Ref64, UUID } from "@owl-factory/types";
import { DataType } from "ts-postgres";
import { Scalar } from "types";
import { BaseDocument, BaseDocumentConversionMap, BaseDocumentV2 } from "./BaseDocument";

// A partial and flattened clone of the content document type for storage within the actor document
export type ActorContent = Record<string, Scalar> & ActorContentMetadata;

// The metadata for a piece of actor content for fields that need to be present
export interface ActorContentMetadata {
  $parentRef?: Ref64; // The parent content that this is copied from
  $contentType?: string; // The content type key that this item belongs to. TODO - required once content types are done
}

export interface ActorDocument extends BaseDocument {
  actorType: string;
  ruleset: {
    ref: Ref64; // The ref for the ruleset this actor uses
  }
  actorSheet: {
    ref: Ref64; // The ref for the actor sheet this actor uses to render
  }
  campaign: {
    ref: Ref64;
  }
  // Simple values defined by the user in custom fields. The bread and butter of the actor's content
  values: Record<string, Scalar>;
  // ...
  content: Record<string, ActorContent[]>;
}

export interface ActorDocumentV2 extends BaseDocumentV2 {
  name: string;
  ruleset_id: UUID;
  campaign_id: UUID;
  actor_sheet_id: UUID;
  fields: Record<string, Scalar>;
  content: Record<string, ActorContent[]>;
}

export const ActorConversionMap: Record<keyof ActorDocumentV2, DataType> = {
  ...BaseDocumentConversionMap,
  name: DataType.Text,
  ruleset_id: DataType.Uuid,
  campaign_id: DataType.Uuid,
  actor_sheet_id: DataType.Uuid,
  fields: DataType.Json,
  content: DataType.Json,
};

