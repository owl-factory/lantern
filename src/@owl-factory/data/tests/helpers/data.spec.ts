import { getSuccessfulDocuments } from "../../utilities/data";

describe("getSuccessfulDocuments", () => {
  test("test", () => {
    const packets = [
      { success: true, doc: { ref: "success"  }},
      { success: false, doc: { ref: "fail"  }},
    ];
    const result = getSuccessfulDocuments(packets);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].ref).toBe("success");
  });
});
