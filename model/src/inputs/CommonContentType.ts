import { InputType } from "type-graphql";
import { CommonContentType } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the Common Content Type document
 */
@InputType()
export class CommonContentTypeInput extends CoreInput implements Partial<CommonContentType> {
}