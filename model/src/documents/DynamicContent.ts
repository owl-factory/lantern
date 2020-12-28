import { prop } from "@typegoose/typegoose";
import GraphQLJSON from "graphql-type-json";
import { Field, ID, ObjectType } from "type-graphql";

/**
 * A singular component of the dyanmic layout. Such atoms include text, 
 * inputs, checkboxes, and so on. 
 */
@ObjectType()
export class LayoutAtom {
  // The atom input to render for this layout. 
  @Field()
  @prop({ required: true })
  type: string;

  // Any styling that we would like to apply to this atom
  @Field(() => GraphQLJSON, { nullable: true })
  @prop()
  style?: Record<string, string>;

  // A string or collection of keys containing static values to render within the atom
  @Field(() => GraphQLJSON, { nullable: true })
  @prop()
  staticValue?: string | Record<string, string>;

  // A string or collection of keys containing the names of variables to use for 
  // fetching data dynamicly
  @Field(() => GraphQLJSON, { nullable: true })
  @prop()
  sourceVariable?: string | Record<string, string>;
}

@ObjectType()
export class LayoutContent {
  // The game system that this LayoutContent belongs to. Unkeyed LayoutContent
  // can be used for reference and amy be copied in, but when changing atoms 
  // will lose any dynamic source variables.
  @Field(() => ID, { nullable: true })
  @prop()
  gameSystemID?: string;

  // Any styling that we would like to apply to this atom
  @Field(() => GraphQLJSON, { nullable: true })
  @prop()
  style?: Record<string, string>;

  @Field(() => [LayoutAtom])
  @prop({ required: true })
  atoms: LayoutAtom[];
}