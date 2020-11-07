import { InputType } from "type-graphql";
import { CommonEntityType } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may both add or update in the common entity type document
 */
@InputType()
class CommonEntityTypeInput extends CoreInput implements Partial<CommonEntityType> {
}

export const CreateCommonEntityTypeInput = CommonEntityTypeInput;
export const UpdateCommonEntityTypeInput = CommonEntityTypeInput;