type ParsedFilters = Record<string, string | RegExp | Record<string, string | number>>;

/**
 * A function for testing of IDs in the event we expand our definition of IDs
 * @param id The string to check for ID-ness
 */
export function isID(id: string): boolean {
  return id.length === 24;
}

/**
 * A recursive function for parsing out nested fields into a single level of Mongoose compatible filters
 *
 * @param filterObject An object that is sent diectly from GQL
 * @param baseKey The key to prepend to any new filter
 */
type FilterObjectType = Record<string, Record<string, string | unknown>>
export function parseFilter(filterObject: FilterObjectType, baseKey = ""): ParsedFilters {
  const fieldKeys = Object.keys(filterObject);
  const parsedFilters: ParsedFilters = {};

  fieldKeys.forEach((fieldKey: string) => {
    if (fieldKey === "or") { return; }

    const field = filterObject[fieldKey];
    // EQ and like are special cases that return strings, not objects
    const filterKeys = Object.keys(field);
    if ("eq" in field && typeof field.eq === "string") {
      parsedFilters[baseKey + fieldKey] = field.eq;
      return;
    }

    else if ("like" in field && typeof field.like === "string") {
      parsedFilters[baseKey + fieldKey] = new RegExp(field.like, 'i');
      return;
    }

    const filterSubobject: Record<string, string | number> = {};
    let addFilter = false;
    filterKeys.forEach((filterKey: string) => {
      switch(filterKey) {
        case "neq":
        case "lte":
        case "lt":
        case "gt":
        case "gte":
          filterSubobject[`$${filterKey}`] = field[filterKey] as string | number;
          addFilter = true;
          break;
        default:

          // Merge parsed Fields with new parsed fields
          const subFields = parseFilter(field as FilterObjectType, `${fieldKey}.`);
          const subFieldKeys = Object.keys(subFields);
          subFieldKeys.forEach((subFieldKey: string) => {
            parsedFilters[subFieldKey] = subFields[subFieldKey];
          });
          return;
      }
    });
    if (addFilter) {
      parsedFilters[baseKey + fieldKey] = filterSubobject;
    }
  });
  return parsedFilters;
}

/**
 * Builds and adds a where clause to a query given the filters
 *
 * @param filters The filters to convert into an or clause for the query
 */
export function buildFilters(filters?: any): Record<string, unknown> {
  if (!filters || Object.keys(filters).length === 0) { return {}; }
  let andFilters: Record<string, unknown> | undefined;
  let orFilters: Record<string, unknown>[] = [];

  // Hacky workaround. "key" in obj has issues, so we need to have this definitively defined
  filters.or = filters.or || [];
  if (filters.or.length) {
    orFilters = [];
    filters.or.forEach((filterOr: any) => {
      orFilters.push(parseFilter(filterOr as FilterObjectType));
    });
  }

  const filterKeys = Object.keys(filters);
  // Ensures we have at least one non-or key
  if (filterKeys.length >= 2 || (filterKeys.length === 1 && !("or" in filters))) {
    andFilters = parseFilter(filters as FilterObjectType);
  }

  if (!orFilters.length && andFilters) { return andFilters; }
  if (!andFilters && orFilters) { return { $or: orFilters }; }

  return {$and: [
    andFilters,
    { $or: orFilters },
  ]};
}