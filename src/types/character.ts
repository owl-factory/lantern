/**
 * Defines a player character, non-player character, or some
 * user-editable entity.
 */
export type Character = {
  id: string;
  name: string;
  data: { name: string } & Record<string, unknown>;
  content: Record<string, unknown>;
};
