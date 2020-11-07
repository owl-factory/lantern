import { InputType } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * Describes the various filters that may be applied to asset documents for searching
 */
@InputType()
export class AssetFilter extends CoreFilter { 
}