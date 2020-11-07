import { InputType } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * Describes the various filters that may be applied to game system documents for searching
 */
@InputType()
export class GameSystemFilter extends CoreFilter { 
}