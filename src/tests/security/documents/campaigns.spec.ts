import { Auth } from "controllers/auth";
import { isOwner } from "security/documents";
import { isPlayer } from "security/documents/campaigns";
import { AnyDocument, CampaignDocument } from "types/documents";

jest.mock("security/documents");

const doc: CampaignDocument = {
  ref: "1",
  ownedBy: {
    ref: "2",
  },
  ruleset: {
    ref: "3",
  },
  banner: {
    ref: "4",
    src: "/img.jpg",
  },
  players: [{ ref: "a" }, { ref: "b" }],
};

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
    Auth.fromAPI(
      { ref: "b", username: "", email: "", 
        avatar: { ref: "", src:"" }, role:"", permissions:[], recentPlayers: [], badges: [] },
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
