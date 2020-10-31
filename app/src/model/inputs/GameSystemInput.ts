import { GameSystem } from "../documents/GameSystem";
import { InputType, Field, Int } from "type-graphql";
import { CoreInput } from "./CoreInput";
import { PublishType } from "../enums/publishType";

@InputType()
export class GameSystemInput extends CoreInput implements Partial<GameSystem>  {
  @Field({ nullable: true })
  description?: string;

  // TODO - auth admin
  // We can maybe get rid of this, since we'll have the ownerID set automatically
  // and the publish type
  @Field({ nullable: true })
  isUserCreated?: boolean;

  @Field(() => Int, { nullable: true })
  publishType?: PublishType;

  @Field({ nullable: true })
  isPublished?: boolean;

  @Field({ nullable: true })
  defaultThemeID?: string;

  @Field({ nullable: true })
  defaultModuleID?: string;
}