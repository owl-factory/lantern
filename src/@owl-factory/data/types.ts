
/**
 * An interface for describing what a user is searching for
 */
export interface SearchParams {
  page?: number; // The page of data to pull
  perPage?: number; // The number of documents per page
  sort?: string[]; // The order of fields and the direction that they should be sorted
  filters?: Record<string, string>; // The fields to filter
  group?: string; // The group of data to search through. 
  skip?: number; // The total number of documents to skip before starting to search. Used in place of page and per page up to the point where the skip ends
}