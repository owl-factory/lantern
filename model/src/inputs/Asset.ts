import { InputType, Field } from "type-graphql";
import { Asset } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the document
 */
@InputType()
export class AssetInput extends CoreInput implements Partial<Asset> {
}