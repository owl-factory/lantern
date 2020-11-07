import { InputType, Field } from "type-graphql";
import { Entity } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the entity document
 */
@InputType()
export class EntityInput extends CoreInput implements Partial<Entity> {
  @Field({ nullable: true })
  gameSystemID?: string;

  @Field({ nullable: true })
  entityTypeID?: string;
}