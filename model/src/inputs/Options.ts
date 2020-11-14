import { ArgsType, Field, Int } from "type-graphql";
import { Min, Max } from "class-validator";

@ArgsType()
export class Options {
  @Field(() => Int)
  @Min(0)
  skip: number = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  limit: number = 25;

  @Field({ nullable: true })
  sort?: string;
}