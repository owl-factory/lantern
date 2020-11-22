import { InputType, Field } from "type-graphql";
import { EntityLayout } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the entity layout document
 */
@InputType()
export class EntityLayoutInput extends CoreInput implements Partial<EntityLayout> {
}

/**
 * Describes the fields that the user may set only when creating the entity layout document
 */
@InputType()
export class CreateEntityLayoutInput extends CoreInput implements Partial<EntityLayout> {
  @Field({ nullable: true })
  gameSystemID?: string;
}

@InputType()
export class UpdateEntityLayoutInput extends EntityLayoutInput implements Partial<EntityLayout>{}
