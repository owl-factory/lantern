import { Ref64 } from "@owl-factory/types";
import { Packet } from "../types";

class MockGroupingController<T extends Record<string, unknown>> {
  public getGroup = jest.fn((name: string): Ref64[] => {
    if (name === "undefined") { return []; }
    return ["1", "2"];
  });

  public addGroup = jest.fn((
    _name: string,
    _validation: (doc: T) => boolean,
    _data: Record<string, Packet<T>>
  ): void => {
    return;
  });

  public removeGroup = jest.fn((name: string): number => {
    if (name === "undefined") { return 0; }
    return 1;
  });
  public clear = jest.fn(() => { return; });
  public onNewDoc = jest.fn((_doc: T) => { return; });
  public onUpdatedDoc = jest.fn((_doc: T) => { return; });
  public onRemoveDoc = jest.fn((_doc: T) => { return; });
}

export const GroupingController = MockGroupingController;
