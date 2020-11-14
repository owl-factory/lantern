import { InputType } from "type-graphql";
import { GameSystem } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the game system document
 */
@InputType()
class GameSystemInput extends CoreInput implements Partial<GameSystem> {
}

@InputType()
export class CreateGameSystemInput extends GameSystemInput implements Partial<GameSystem>{};
@InputType()
export class UpdateGameSystemInput extends GameSystemInput implements Partial<GameSystem>{};