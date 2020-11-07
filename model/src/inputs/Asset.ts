import { InputType, Field } from "type-graphql";
import { Asset } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may both add or update in the asset document
 */
@InputType()
export class AssetInput extends CoreInput implements Partial<Asset> {
}

export const CreateAssetInput = AssetInput;
export const UpdateAssetInput = AssetInput;