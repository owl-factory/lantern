import { InputType, Field } from "type-graphql";
import { Asset } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may both add or update in the asset document
 */
@InputType()
class AssetInput extends CoreInput implements Partial<Asset> {
}

@InputType()
export class CreateAssetInput extends AssetInput implements Partial<Asset>{};
@InputType()
export class UpdateAssetInput extends AssetInput implements Partial<Asset>{};