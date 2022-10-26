// A page group is a collection of the different pages and their details for a single Pageable object
export type PageGroup = Record<string, PageDetails>;
// Desdcribes any additional details about a page that may be useful for rendering or security
export type PageDetails = {}; // TODO - fill out with any rendering information, such as permissions
