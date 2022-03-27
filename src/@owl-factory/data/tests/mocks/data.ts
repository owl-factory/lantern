import { DataController } from "@owl-factory/data/data";
import { Ref64 } from "@owl-factory/types";
import { CrudPacket } from "@owl-factory/types/object";
import { ReloadPolicy } from "../../enums";
import { newMetadata, newPacket } from "../../helpers/caching";
import { Packet } from "../../types";

// TODO - simplify the mock functions. Require overrides for certain cases

export const mockDataController: any = {
  get: jest.fn((ref: Ref64): Packet<any> | undefined => {
    if (ref === "fail") { return undefined; }
    else if (ref) {
      return newPacket({ ref }, newMetadata(true, 0)) as Packet<any>;
    }
    return undefined;
  }),

  getMany: jest.fn((refs: Ref64): Packet<any>[] => {
    const packets: Packet<any>[] = [];
    for (const ref of refs) {
      const packet = mockDataController.get(ref);
      if (packet !== undefined) { packets.push(packet); }
    }
    return packets;
  }),

  set: jest.fn((packet: Packet<any>): Packet<any> => {
    return packet;
  }),

  setMany: jest.fn((packets: Packet<any>[]): Packet<any>[] => {
    return packets;
  }),

  load: jest.fn(async (
    refs: string | string[],
    _reloadPolicy: ReloadPolicy,
    _loadDocuments: (refs: Ref64[]) => Promise<CrudPacket<any>[]>
  ): Promise<any[]> => {
    const docs: any[] = [];
    const refList = Array.isArray(refs) ? refs : [refs];
    for (const ref of refList) {
      const doc: any = { ref };
      docs.push(doc);
    }
    return docs;
  }),
  clear: jest.fn((): void => { return; }),
  remove: jest.fn((ref: Ref64): Packet<any> | undefined => { return mockDataController.get(ref); }),
  getAll: jest.fn(() => {
    return {
      "1": mockDataController.get("1"),
    };
  }),
  getRefs: jest.fn(() => {
    return ["1"];
  }),
};

// (DataController as any).mockImplementation(MockDataController);

