import { IsDefined } from "class-validator";

/**
 * The CoreInput for fields for all document creation and updating
 */
export class CoreInput {
  @IsDefined()
  name!: string;
}
