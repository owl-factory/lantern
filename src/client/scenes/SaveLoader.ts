import { SceneDocument } from "types/documents/Scene";
import { ServerResponse } from "types/utilities";
import { rest } from "utilities/request";
import { SceneController } from "./SceneController";

interface FetchSceneResponse {
  scene: SceneDocument;
}

const API_ENDPOINT = "/api/scene";

export class SaveLoader {
  private controller: SceneController;
  private locked: boolean;

  public constructor(controller: SceneController) {
    this.controller = controller;
    this.locked = false;
  }

  /**
   * Fetches and loads in the current scene.
   */
  // public async load(): Promise<boolean> {
  //   if (this.sceneID === undefined) { return false; }

  //   try {
  //     const scene = await this.fetchScene();
  //   } catch (e) {
  //     console.error(e);
  //     return false;
  //   }
  //   return true;
  // }
  
  /**
   * TODO - rather than building the entirety of the scene to save and overwrite, we build up a list
   * of changes in a dispatch controller and send that to patch over any new changes.
   */
  public async save(): Promise<void> {
    if (this.locked) { return; }
    this.locked = true;

    try {
      const sceneID = this.controller.getID();
      let response: ServerResponse<FetchSceneResponse>;
      if (sceneID === undefined) { response = await this.saveNew(); }
      else { response = await this.saveExisting(); }
    } finally {
      this.locked = false;
    }
  }

  /**
   * Saves an entirely new scene to the database
   */
  protected async saveNew(): Promise<ServerResponse<FetchSceneResponse>> {
    const response = await rest.post<FetchSceneResponse>(
      `${API_ENDPOINT}`,
      { scene: this.buildSceneDocument() },
    );

    if (!response.success) { throw response.message; }
    this.controller.setID(response.data.scene.id as string);

    return response;
  }

  /**
   * Updates an existing scene owned by the current user
   */
  protected async saveExisting(): Promise<ServerResponse<FetchSceneResponse>> {
    const sceneResponse = await rest.patch<FetchSceneResponse>(
      `${API_ENDPOINT}/${this.controller.getID()}`,
      { scene: this.buildSceneDocument() }
    );
    return sceneResponse;
  }

  public buildSceneDocument(): SceneDocument {
    const scene: SceneDocument = {
      name: this.controller.getName(),
      grid: this.controller.getGrid().export(),
      props: this.controller.getPropManager().export(),
      scene: this.controller.getScene().export(),
    };

    return scene;
  }

  private async fetchScene(): Promise<SceneDocument> {
    const sceneResponse = await rest.get<FetchSceneResponse>(`${API_ENDPOINT}${this.controller.getID()}`);
    if (!sceneResponse.success) {
      throw sceneResponse.message;
    }
    return sceneResponse.data.scene;
  }


}