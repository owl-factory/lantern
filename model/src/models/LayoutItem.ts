import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class LayoutItem {
  @Field()
  name: string;

  @Field()
  componentKey: string;

  // Not sure what this does. Plan this out again?
  @Field(() => [String])
  variables: string[];
  
  @Field(() => [String])
  stylingTags: string[];
}