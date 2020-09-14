import { GameSystem } from "../documents/GameSystem";
import { InputType, Field } from "type-graphql";
import { CoreInput } from "./CoreInput";

@InputType()
export class GameSystemInput extends CoreInput implements Partial<GameSystem>  {
  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  isUsedCreated?: boolean;

  @Field({ nullable: true })
  defaultModuleID?: string;

  @Field({ nullable: true })
  isPublished?: boolean;

  @Field({ nullable: true })
  isPurchasable?: boolean;

  @Field({ nullable: true })
  defaultThemeID?: string;
}