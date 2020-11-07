import { InputType, Field } from "type-graphql";
import { EntityType } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the entity type document
 */
@InputType()
export class EntityTypeInput extends CoreInput implements Partial<EntityType> {
  @Field({ nullable: true })
  gameSystemID?: string;

  @Field({ nullable: true })
  commonEntityTypeID?: string;
}