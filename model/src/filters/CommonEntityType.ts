import { InputType } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * Describes the various filters that may be applied to common entity type documents for searching
 */
@InputType()
export class CommonEntityTypeFilter extends CoreFilter { 
}