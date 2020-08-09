/**
 * Defines the base fields that a database object will have or are reference-able
 * ID is expected to always be pulled
 * @param id The unique id of the particular database object
 * @param isActive Boolean describing if this item is active. This may be removed in the future
 * @param createdBy The id of the user that created this object
 * @param editedBy The id of the user that last edited this object
 * @param deletedBy The id of the user that deleted this object (soft deletes). This may be removed in the future
 * @param createdAt The datetime in milliseconds of when the object was created
 * @param editedAt The datetime in milliseconds of when the object was last edited
 * @param deletedAt The datetime in milliseconds of when the object  was soft deleted. This may be removed in the future.
 */
export default interface Model {
  id: string;
  isActive?: boolean;
  createdBy?: string;
  editedBy?: string;
  deletedBy?: string;
  createdAt?: number;
  editedAt?: number;
  deletedAt?: number;
}