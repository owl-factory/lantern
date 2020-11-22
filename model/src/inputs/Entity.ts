import { InputType, Field } from "type-graphql";
import { Entity } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may both add or update in the entity document
 */
@InputType()
export class EntityInput extends CoreInput implements Partial<Entity> {
  @Field({ nullable: true })
  entityTypeID?: string;
}

/**
 * Describes the fields that the user may set only when creating the entity document
 */
@InputType()
export class CreateEntityInput extends EntityInput implements Partial<Entity> {
  @Field({ nullable: true })
  gameSystemID?: string;
}

@InputType()
export class UpdateEntityInput extends EntityInput implements Partial<Entity>{}