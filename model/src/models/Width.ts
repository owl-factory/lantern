import { prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

// TODO - bump these up to a max width of 24
type WidthOptions = 12 | 8 | 6 | 4 | 3 | 2 | 1;


/**
 * An object that describes the width of an dynamic layout object
 * in terms of 12 or 24 segments
 */
@ObjectType()
export class Width {
  @Field()
  @prop({ required: true })
  xs: WidthOptions;

  @Field({ nullable: true })
  @prop()
  sm?: WidthOptions;

  @Field({ nullable: true })
  @prop()
  md?: WidthOptions;

  @Field({ nullable: true })
  @prop()
  lg?: WidthOptions;

  @Field({ nullable: true })
  @prop()
  xl?: WidthOptions;
}