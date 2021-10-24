/**
 * The primary handler for all scene-related stuff.
 */
class $ActiveSceneController {
  public id: string;

  constructor() {
    this.id = "";
  }

  public new() {
    return;
  }

  public load(id: string) {
    return;
  }
}

export const ActiveSceneController = new $ActiveSceneController();
