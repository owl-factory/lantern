import { ObjectType, ID, Field } from "type-graphql";
import { CoreDocument } from "./CoreDocument";
import { prop } from "@typegoose/typegoose";


export class EntityTypeField {

}

@ObjectType()
export class EntityType extends CoreDocument {
  @Field(() => ID)
  @prop({ required: true })
  gameSystemID: string;

  @Field(() => [EntityTypeField])
  @prop({ type: () => [EntityTypeField] })
  fields: EntityTypeField[];

  @Field(() => ID)
  @prop() // TODO - make required: true when we have entityLayoutIDs to work with
  defaultEntityLayoutID: string;

  @Field(() => [ID])
  @prop({ type: () => [String] })
  supersetOf: string[];

  @Field(() => [ID])
  @prop({ type: () => [String] })
  subsetOf: string[];
}