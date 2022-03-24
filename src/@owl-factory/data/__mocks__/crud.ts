import { CrudPacket } from "@owl-factory/types/object";

export const create = jest.fn(async (_url: string, _docs: any[]): Promise<CrudPacket<any>[]> => {
  return [{ success: true, doc: { ref: "create" }} ];
});

export const read = jest.fn(async (_url: string, _refs: any[]): Promise<CrudPacket<any>[]> => {
  return [{ success: true, doc: { ref: "read" }} ];
});

export const update = jest.fn(async (_url: string, _docs: any[]): Promise<CrudPacket<any>[]> => {
  return [{ success: true, doc: { ref: "update" }} ];
});

export const del = jest.fn(async (_url: string, _refs: any[]): Promise<CrudPacket<any>[]> => {
  return [{ success: true, doc: { ref: "delete" }} ];
});
