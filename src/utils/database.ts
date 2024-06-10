/**
 * Interface for input and return values of the UpdateTimestamp database utility function.
 */
interface Timestamped {
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Database utility function for updating a rows timestamp columns.
 * @param rowUpdate - object representing the timestamp columns (createdAt and updatedAt) of a database row.
 * @returns - updated timestamp columns object with the updatedAt field set to the current UTC time.
 */
export function UpdateTimestamp(rowUpdate: Timestamped) {
  rowUpdate.updatedAt = Now();
  return rowUpdate;
}

/**
 * Helper function for quickly getting the current time in a `Date` format.
 * @returns - Date object representing the current time in UTC.
 */
export function Now(): Date {
  return new Date(Date.now());
}
