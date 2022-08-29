import { create, del, read, update } from "../../controllers/functionality/crud";
import { CrudPacket } from "@owl-factory/types/object";

(create as any).mockImplementation(async (_url: string, _docs: any[]): Promise<CrudPacket<any>[]> => {
  return [{ success: true, doc: { ref: "create" }} ];
});

(read as any).mockImplementation(async (_url: string, _refs: any[]): Promise<CrudPacket<any>[]> => {
  return [{ success: true, doc: { ref: "read" }} ];
});

(update as any).mockImplementation(async (_url: string, _docs: any[]): Promise<CrudPacket<any>[]> => {
  return [{ success: true, doc: { ref: "update" }} ];
});

(del as any).mockImplementation(async (_url: string, _refs: any[]): Promise<CrudPacket<any>[]> => {
  return [{ success: true, doc: { ref: "delete" }} ];
});
