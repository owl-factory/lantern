import { InputType, Field, ID, Int } from "type-graphql";
import { CoreInput } from "./CoreInput";
import { Content } from "../documents/Content";
import GraphQLJSON from 'graphql-type-json';

/**
 * The input model for creating a new piece of content. 
 */
@InputType()
export class ContentInput extends CoreInput implements Partial<Content> {
  @Field(() => ID, { nullable: true })
  gameSystemID?: string;

  @Field(() => ID, { nullable: true })
  sourceContentID?: string;

  @Field(() => ID, { nullable: true })
  contentTypeID?: string;

  @Field(() => [ID], { nullable: true })
  moduleIDs?: string[];

  @Field(() => Int, { nullable: true })
  publishType?: number;

  @Field(() => Boolean, { nullable: true })
  isPurchasable?: boolean;

  @Field(() => GraphQLJSON, { nullable: true })
  data?: any;
}