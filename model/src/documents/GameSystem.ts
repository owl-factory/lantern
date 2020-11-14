import { ObjectType} from "type-graphql";
import { getModelForClass } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";

@ObjectType()
export class GameSystem extends CoreDocument {
}

export const GameSystemModel = getModelForClass(GameSystem);
