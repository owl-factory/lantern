import { StorageControllerState } from "features/dynamicRender/types/controllers/storage";
import { LocalStorageController } from "./localStorage";
import { safeMakeObservable } from "lib/mobx";
import { Err } from "utils/functional";
import { getLocalStorage } from "utils/localStorage";
import { Character } from "types/character";
import { QuerySource } from "features/dynamicRender/types/query";

jest.mock("lib/mobx");
jest.mock("utils/localStorage");

const CHARACTER_ID = "1234";

describe("LocalStorage constructor tests", () => {
  test("Initializes the LocalStorageController", () => {
    const controller = new LocalStorageController(CHARACTER_ID);
    expect(controller._state).toBe(StorageControllerState.Initialized);
  });

  test("Initializes the LocalStorageController", () => {
    jest.mocked(safeMakeObservable).mockImplementationOnce(() => Err("Rip"));
    const controller = new LocalStorageController(CHARACTER_ID);
    expect(controller._state).toBe(StorageControllerState.MobxError);
  });
});

describe("LocalStorage load tests", () => {
  let controller: LocalStorageController;

  beforeEach(() => {
    controller = new LocalStorageController(CHARACTER_ID);
    jest.mocked(getLocalStorage).mockClear();
  });

  test("loads successfully", () => {
    controller.load();
    expect(getLocalStorage).toHaveBeenCalled();
    expect(controller._state).toBe(StorageControllerState.Ready);
  });

  test("local storage is missing", () => {
    jest.mocked(getLocalStorage).mockImplementationOnce(() => Err("Oh no"));

    controller.load();

    expect(getLocalStorage).toHaveBeenCalled();
    expect(controller._state).toBe(StorageControllerState.LocalStorageMissing);
  });

  test("not initialized", () => {
    controller._state = StorageControllerState.Ready;

    controller.load();

    expect(getLocalStorage).not.toHaveBeenCalled();
    expect(controller._state).toBe(StorageControllerState.Ready);
  });
});

describe("LocalStorage get tests", () => {
  let controller: LocalStorageController;

  beforeEach(() => {
    controller = new LocalStorageController(CHARACTER_ID);
  });

  test("Get character data correctly", () => {
    const character = { data: { name: "Waals O'Caera" } } as Character;
    controller._character = character;

    const res = controller.get({ source: QuerySource.Character, key: "name" });
    expect(res).toBe(character.data.name);
  });
});

describe("LocalStorage get tests", () => {
  let controller: LocalStorageController;

  beforeEach(() => {
    controller = new LocalStorageController(CHARACTER_ID);
  });

  test("Get character data correctly", () => {
    const newName = "Waals Brodnen";
    const character = { data: { name: "Waals O'Caera" } } as Character;
    controller._character = character;

    controller.update({ source: QuerySource.Character, key: "name" }, newName);
    expect(controller._character.data.name).toBe(newName);
  });
});
