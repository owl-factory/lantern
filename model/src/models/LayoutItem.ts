import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class LayoutItem {
  @Field()
  name: string;

  @Field()
  componentKey: string;

  @Field(() => [String])
  variables: string[];
  
  @Field(() => [String])
  stylingTags: string[];
}