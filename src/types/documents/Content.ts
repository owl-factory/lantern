import { CoreDocument } from "./CoreDocument";

/**
 * A model describing the Content document, which contains the static information
 * about items within a game system--for example, the spell 'Fireball'.
 */
export class Content extends CoreDocument {
  gameSystemID?: string;

  contentTypeID?: string;

  data!: Record<string, string>;
}
