import { CoreDocument } from "../documents/CoreDocument";
import { Field, InputType } from "type-graphql";

@InputType()
export class CoreInput implements Partial<CoreDocument> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  alias?: string;
}
