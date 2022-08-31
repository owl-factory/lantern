import { DataController } from "../controllers/DataController";
import { newMetadata, newPacket } from "../utilities/caching";
import { Packet } from "../types";


describe("DataController Functions", () => {
  let data: DataController<Record<string, unknown>>;
  let packet: Packet<Record<string, unknown>>;
  beforeEach(() => {
    data = new DataController(30 * 60 * 1000);
    packet = newPacket({ref: "1"}, newMetadata(false));
  });

  test("clear", () => {
    data.set(packet);
    expect(data.getRefs().length).toBe(1);
    data.clear();
    expect(data.getRefs().length).toBe(0);
  });

  test("get", () => {
    const initialGet = data.get("1");
    expect(initialGet).toBeUndefined();

    data.set(packet);
    const finalGet = data.get("1");
    expect(finalGet).toBeDefined();
  });

  test("getMany", () => {
    const initialGet = data.getMany(["1"]);
    expect(initialGet).toStrictEqual([]);

    data.set(packet);
    const finalGet = data.getMany(["1"]);
    expect(finalGet).toStrictEqual([packet]);
  });

  test("set", () => {
    expect(data.getRefs().length).toBe(0);

    data.set(packet);
    expect(data.getRefs().length).toBe(1);
    expect(data.get("1")).toBeDefined();
  });

  test("setMany", () => {
    expect(data.getRefs().length).toBe(0);

    data.setMany([packet]);
    expect(data.getRefs().length).toBe(1);
    expect(data.get("1")).toBeDefined();
  });

  test("remove", () => {
    expect(data.getRefs().length).toBe(0);
    data.set(packet);
    expect(data.getRefs().length).toBe(1);
    data.remove("1");
    expect(data.getRefs().length).toBe(0);
  });
});
