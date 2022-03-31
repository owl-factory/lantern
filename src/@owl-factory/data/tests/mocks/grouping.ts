import { Ref64 } from "@owl-factory/types";
import { Packet } from "../../types";

export const mockGroupingController: any = {
  getGroup: jest.fn((name: string): Ref64[] => {
    if (name === "undefined") { return []; }
    return ["1", "2"];
  }),

  addGroup: jest.fn((
    _name: string,
    _validation: (doc: any) => boolean,
    _data: Record<string, Packet<any>>
  ): void => {
    return;
  }),

  removeGroup: jest.fn((name: string): number => {
    if (name === "undefined") { return 0; }
    return 1;
  }),
  clear: jest.fn(() => { return; }),
  onNewDoc: jest.fn((_doc: any) => { return; }),
  onUpdatedDoc: jest.fn((_doc: any) => { return; }),
  onRemoveDoc: jest.fn((_doc: any) => { return; }),
};
