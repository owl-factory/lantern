import { Character } from "../documents/Character";
import { InputType, Field } from "type-graphql";

@InputType()
export class CharacterInput implements Partial<Character> {
  @Field({ nullable: true })
  name?: string;
}