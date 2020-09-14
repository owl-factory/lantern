import { ArgsType, Field, Int } from "type-graphql";
import { Min, Max } from "class-validator";

@ArgsType()
export class Options {
  @Field(_type => Int)
  @Min(0)
  skip: number = 0;

  @Field(_type => Int)
  @Min(1)
  @Max(50)
  limit: number = 25;

  @Field({ nullable: true })
  sort?: string;
}