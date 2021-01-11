import { idify } from "../../utilities/tools";

test("idify Dungeons & Dragons, 5E is dungeons-dragons-5e", () => {
  expect(idify("Dungeons & Dragons, 5E")).toBe("dungeons-dragons-5e");
});
