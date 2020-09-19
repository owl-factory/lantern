import { GameSystem } from "../documents/GameSystem";
import { InputType, Field } from "type-graphql";
import { CoreInput } from "./CoreInput";

@InputType()
export class GameSystemInput extends CoreInput implements Partial<GameSystem>  {
  @Field({ nullable: true })
  description?: string;

  // TODO - auth admin
  @Field({ nullable: true })
  isUserCreated?: boolean;

  @Field({ nullable: true })
  isPublished?: boolean;

  @Field({ nullable: true })
  defaultThemeID?: string;

  @Field({ nullable: true })
  defaultModuleID?: string;
}