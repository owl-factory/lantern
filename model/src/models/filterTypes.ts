import { FilterOperator } from "type-graphql-filter";

export const booleanFilters: FilterOperator[] = ["eq", "ne"];
export const dateFilters: FilterOperator[] = ["eq", "ne", "gt", "gte", "lt", "lte"];
export const idFilters: FilterOperator[] = ["eq", "ne"];
export const numberFilters: FilterOperator[] = ["eq", "ne", "gt", "gte", "lt", "lte"];
export const stringFilters: FilterOperator[] = ["eq", "ne", "like"];