import { InputType } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * Describes the various filters that may be applied to asset documents for searching
 */
@InputType()
export class AssetFilter extends CoreFilter { 
}

/**
 * Extends the original filters to have the base filters and any additional or operators
 */
@InputType()
export class AssetFilters extends AssetFilter {
  or?: AssetFilter[];
}