import { Data } from "types/database";
import { expand, flatten } from "utils/data";

const staticExample = {
  name: "Fireball",
  level: "3",
  castingTime: "1 action",
  range: "150ft",
  classes: "Sorcerer, Wizard",
};

const expandedExample1 = {
  name: "Laura Wenning",
  pronouns: "she/her",
  stats: {
    abilityScores: {
      intelligence: "18",
      wisdom: "14",
      charisma: "10",
      strength: "12",
      constitution: "12",
      dexterity: "14",
    },
    ac: "12",
  },
  content: {
    items: ["Framework Laptop", "Note 9", "Cuteness"],
    spells: ["Fireball", "Firebolt"],
  },
};

const expandedExample2 = {
  ok: { how: { far: { can: { we: ["go?", "!?"] } } } },
};

const flatExample1 = {
  name: "Laura Wenning",
  pronouns: "she/her",
  "stats.abilityScores.intelligence": "18",
  "stats.abilityScores.wisdom": "14",
  "stats.abilityScores.charisma": "10",
  "stats.abilityScores.strength": "12",
  "stats.abilityScores.constitution": "12",
  "stats.abilityScores.dexterity": "14",
  "stats.ac": "12",
  "content.items[0]": "Framework Laptop",
  "content.items[1]": "Note 9",
  "content.items[2]": "Cuteness",
  "content.spells[0]": "Fireball",
  "content.spells[1]": "Firebolt",
};

const flatExample2 = { "ok.how.far.can.we[0]": "go?", "ok.how.far.can.we[1]": "!?" };

describe("flatten function tests", () => {
  test("expandedExample1 is flattened properly.", () => {
    const flat = flatten(expandedExample1);
    expect(flat.ok).toBe(true);
    expect((flat as OkResult<Data>).data).toEqual(flatExample1);
  });

  test("expandedExample2 is flattened properly.", () => {
    const flat = flatten(expandedExample2);
    console.log(flat);
    expect(flat.ok).toBe(true);
    expect((flat as OkResult<Data>).data).toEqual(flatExample2);
  });

  test("staticExample is unchanged when flattened due to it having no depth.", () => {
    const flat = flatten(staticExample);
    expect(flat.ok).toBe(true);
    expect((flat as OkResult<Data>).data).toEqual(staticExample);
  });
});

describe("expand function tests", () => {
  test("flatExample1 is expanded properly.", () => {
    const expanded = expand(flatExample1);
    expect(expanded).toEqual(expandedExample1);
  });

  test("flatExample2 is expanded properly.", () => {
    const expanded = expand(flatExample2);
    expect(expanded).toEqual(expandedExample2);
  });

  test("staticExample is unchanged when expanded due to it not having any keys representing depth.", () => {
    const expanded = expand(staticExample);
    expect(expanded).toEqual(staticExample);
  });
});
