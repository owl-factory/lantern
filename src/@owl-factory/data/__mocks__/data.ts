import { Ref64 } from "@owl-factory/types";
import { CrudPacket } from "@owl-factory/types/object";
import { getUniques } from "@owl-factory/utilities/arrays";
import { ReloadPolicy } from "../enums";
import { newMetadata, newPacket } from "../helpers/caching";
import { Packet } from "../types";

class MockDataController<T extends Record<string, unknown>> {
  public get = jest.fn((ref: Ref64): Packet<T> | undefined => {
    if (ref === "fail") { return undefined; }
    else if (ref) {
      return newPacket({ ref }, newMetadata(true, 0)) as Packet<T>;
    }
    return undefined;
  });

  public getMany = jest.fn((refs: Ref64): Packet<T>[] => {
    const packets: Packet<T>[] = [];
    for (const ref of refs) {
      const packet = this.get(ref);
      if (packet !== undefined) { packets.push(packet); }
    }
    return packets;
  });

  public set = jest.fn((packet: Packet<T>): Packet<T> => {
    return packet;
  });

  public setMany = jest.fn((packets: Packet<T>[]): Packet<T>[] => {
    return packets;
  });

  public load = jest.fn(async (
    refs: string | string[],
    _reloadPolicy: ReloadPolicy,
    _loadDocuments: (refs: Ref64[]) => Promise<CrudPacket<T>[]>
  ): Promise<T[]> => {
    const docs: T[] = [];
    const refList = Array.isArray(refs) ? refs : [refs];
    for (const ref of refList) {
      const doc: any = { ref };
      docs.push(doc);
    }
    return docs;
  });
  public clear = jest.fn((): void => { return; });
  public remove = jest.fn((ref: Ref64): Packet<T> | undefined => { return this.get(ref); });
  public getAll = jest.fn(() => {
    return {
      "1": this.get("1"),
    };
  });
  public getRefs = jest.fn(() => {
    return ["1"];
  });
}

export const DataController = MockDataController;
