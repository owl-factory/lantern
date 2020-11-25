import { InputType } from "type-graphql";
import { CommonContentType } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may both add or update in the Common Content Type document
 */
@InputType()
class CommonContentTypeInput extends CoreInput implements Partial<CommonContentType> {
}

@InputType()
export class CreateCommonContentTypeInput extends CommonContentTypeInput implements Partial<CommonContentType>{}
@InputType()
export class UpdateCommonContentTypeInput extends CommonContentTypeInput implements Partial<CommonContentType>{}
