import { InputType, Field } from "type-graphql";
import { EntityType } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the entity type document
 */
@InputType()
class EntityTypeInput extends CoreInput implements Partial<EntityType> {
  @Field({ nullable: true })
  commonEntityTypeID?: string;
}

/**
 * Describes the fields that the user may set only when creating the entity type document
 */
@InputType()
export class CreateEntityTypeInput extends EntityTypeInput implements Partial<EntityType> {
  @Field({ nullable: true })
  gameSystemID?: string;
}

@InputType()
export class UpdateEntityTypeInput extends EntityTypeInput implements Partial<EntityType>{};