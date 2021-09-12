import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";

const ContentTypeLogicBuilder = new FaunaLogicBuilder("contentTypes")
  // Globals
  // Users are only able to view campaigns if they are a player, and all fields if they are an owner/GM
  .fields()
    .guest([])
    .user(["*"])
    .admin(["*"])
  .done()
  .roles()
    .guest(false)
    .user(true)
    .admin(true)
  .done()

  /**
   * Initializes the fetch function from defaults
   */
  .fetch()
  .done()

  /**
   * Creates a function for fetching many campaign documents at once. It should use the same
   * logic and security as the ordinary fetch fucntion
   */
  .fetchMany()
  .done()
.done();
export const ContentTypeLogic = ContentTypeLogicBuilder.export();
