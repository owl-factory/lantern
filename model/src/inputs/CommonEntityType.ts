import { InputType } from "type-graphql";
import { CommonEntityType } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the common entity type document
 */
@InputType()
export class CommonEntityTypeInput extends CoreInput implements Partial<CommonEntityType> {
}