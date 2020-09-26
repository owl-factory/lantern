import { Character } from "../documents/Character";
import { InputType } from "type-graphql";
import { CoreInput } from "./CoreInput";

@InputType()
export class CharacterInput extends CoreInput implements Partial<Character>  {
}