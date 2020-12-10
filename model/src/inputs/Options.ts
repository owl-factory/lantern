import { ArgsType, Field, Int } from "type-graphql";
import { Max, Min } from "class-validator";

@ArgsType()
export class Options {
  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  limit = 25;

  @Field({ nullable: true })
  sort?: string;
}
