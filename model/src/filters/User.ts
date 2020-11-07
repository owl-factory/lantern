import { InputType } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * Describes the various filters that may be applied to user documents for searching
 */
@InputType()
export class UserFilter extends CoreFilter { 
}