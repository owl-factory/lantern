import { Severity, modelOptions, prop } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";

@modelOptions({ schemaOptions: { collection: "tables" }, options: { allowMixed: Severity.ALLOW } } )
export class TableDoc extends CoreDocument {
  // The owner of the table. Eventually transferable
  @prop()
  ownerID!: string;

  // The campaigns played at this table
  @prop()
  campaignIDs?: string[];


  // All players in this game
  @prop()
  playerIDs?: string[];
}
