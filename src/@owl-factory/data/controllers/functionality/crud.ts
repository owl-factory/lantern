import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { rest } from "@owl-factory/https";
import { Ref64 } from "@owl-factory/types";
import { CrudPacket } from "@owl-factory/types/object";

interface ResponsePacket<T> {
  docs: CrudPacket<T>[];
}

/**
 * Creates one or multiple documents using a given URL
 * @param url The url to use for creating documents
 * @param docs The documents to create
 * @returns A list of CrudPackets with the result of each document creation
 */
export async function create<T>(url: string, docs: T[]): Promise<CrudPacket<T>[]> {
  try {
    const result = await rest.put<ResponsePacket<T>>(url, { docs });
    if (!result.success) {
      console.error(result.message);
      return [];
    }
    return result.data.docs;

  } catch (e) {
    console.log(`A fatal error has occured while attempting to create documents at '${url}'`);
    console.log(e);
    return [];
  }
}

/**
 * Raeds one or multiple documents using the given URL
 * @param url The URL to use for reading documents
 * @param refs The documents to read. Each doc must contain a ref
 * @returns A list of CrudPackets with the udated document or error messages
 */
export async function read<T>(url: string, refs: Ref64[]): Promise<CrudPacket<T>[]> {
  try {
    const result = await rest.post<ResponsePacket<T>>(url, { refs });
    if (!result.success) {
      console.error(result.message);
      return [];
    }
    return result.data.docs;
  } catch (e) {
    console.log(`A fatal error has occured while attempting to read documents at '${url}'`);
    console.log(e);
    return [];
  }
}

/**
 * Updates one or multiple documents using the given URL
 * @param url The URL to use for updating documents
 * @param docs The documents to update. Each doc must contain a ref
 * @returns A list of CrudPackets with the udated document or error messages
 */
export async function update<T>(url: string, docs: T[]): Promise<CrudPacket<T>[]> {
  try {
    const result = await rest.patch<ResponsePacket<T>>(url, { docs });
    if (!result.success) {
      console.error(result.message);
      return [];
    }
    return result.data.docs;
  } catch (e) {
    console.log(`A fatal error has occured while attempting to update documents at '${url}'`);
    console.log(e);
    return [];
  }
}

/**
 * Deletes one or multiple documents using the given URL
 * @param url The URL to use for deleting documents
 * @param refs The list of documents to delete
 * @returns A list of CrudPackets containing the deleted documents
 */
export async function del<T>(url: string, refs: Ref64[]): Promise<CrudPacket<T>[]> {
  try {
    const result = await rest.delete<ResponsePacket<T>>(url, { refs });
    if (!result.success) {
      console.error(result.message);
      return [];
    }
    return result.data.docs;
  } catch (e) {
    console.log(`A fatal error has occured while attempting to delete documents at '${url}'`);
    console.log(e);
    return [];
  }
}

/**
 * Requests a database search from the server
 * @param url The url endpoint for this search
 * @param terms The search terms for running the search
 * @returns An array of partial documents
 */
export async function search<T> (
  url: string,
  terms: Record<string, string | number | boolean> = {},
  options?: FaunaIndexOptions // What should this be? The page/perPage stuff for index searches
): Promise<T[]> {
  try {
    const result = await rest.post<ResponsePacket<T>>(url, { terms, options });
    if (!result.success) {
      console.error(result.message);
      return [];
    }
    return result.data.docs as any;
  } catch (e) {
    console.log(`A fatal error has occured while attempting to delete documents at '${url}'`);
    console.log(e);
    return [];
  }
}

