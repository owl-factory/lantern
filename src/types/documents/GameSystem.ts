import { getModelForClass, modelOptions, Severity } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";

@modelOptions({ options: { allowMixed: Severity.ALLOW } } )
export class GameSystem extends CoreDocument {
}

export const GameSystemModel = getModelForClass(GameSystem);
