import { getDefaultDocument } from "@owl-factory/database/utilities/migrations/fauna/access";
import { Auth } from "controllers/auth";
import { isOwner } from "security/documents";
import { isPlayer } from "security/documents/campaigns";
import { AnyDocument, CampaignDocument, UserDocument } from "types/documents";

jest.mock("security/documents");

const doc = getDefaultDocument<CampaignDocument>("campaigns");
doc.ref = "1";
doc.ownedBy = { ref: "2" };
doc.ruleset = { ref: "3" };
doc.banner = { ref: "4", src: "/img.jpg" };
doc.players = [ { ref: "a"}, { ref: "b" }];

describe("isPlayer", () => {
  test("undefined", () => {
    const res = isPlayer(undefined);
    expect(res).toBeFalsy();
  });

  test("isOwner", () => {
    (isOwner as any).mockImplementationOnce((_doc: AnyDocument) => true);
    const res = isPlayer(doc);
    expect(res).toBeTruthy();
  });

  test("isPlayer", () => {
    const userDoc = getDefaultDocument<UserDocument>("users");
    userDoc.ref = "b";
    Auth.fromAPI(
      userDoc,
      "",
      ""
    );
    const res = isPlayer(doc);
    expect(res).toBeTruthy();
    Auth.reset();
  });

  test("not in players", () => {
    const res = isPlayer(doc);
    expect(res).toBeFalsy();
  });
});
