import { getModelForClass } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";

export class GameSystem extends CoreDocument {
}

export const GameSystemModel = getModelForClass(GameSystem);
