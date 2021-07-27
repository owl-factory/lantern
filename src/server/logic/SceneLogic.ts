import { SceneDocument } from "types/documents/Scene";
import { CoreModelLogic } from ".";
import { DocumentReference, MyUserDocument } from "./CoreModelLogic";

export class SceneLogic {
  public static async fetchScene(ref: DocumentReference, myUser: MyUserDocument): Promise<SceneDocument | null> {
    const scene = await CoreModelLogic.fetchByRef(ref);
    return scene;
  }

  
}