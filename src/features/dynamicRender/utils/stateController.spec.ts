import { safeMakeObservable } from "lib/mobx";
import { Err } from "utils/results";
import { StateController, StateControllerState } from "./stateController";

jest.mock("lib/mobx");

describe("StateController - constructor tests", () => {
  test("Mobx Error", () => {
    jest.mocked(safeMakeObservable).mockImplementationOnce(() => Err("sad face"));

    const stateController = new StateController();
    expect(stateController._state).toBe(StateControllerState.MobxError);
  });

  test("Ready", () => {
    const stateController = new StateController();
    expect(stateController._state).toBe(StateControllerState.Ready);
  });
});

describe("StateController - ready tests", () => {
  const stateController = new StateController();
  test("is ready", () => {
    stateController._state = StateControllerState.Ready;
    expect(stateController.ready).toBe(true);
  });

  test("is not ready", () => {
    stateController._state = StateControllerState.NoOp;
    expect(stateController.ready).toBe(false);
  });
});

describe("StateController - createCollapse tests", () => {
  const key = "foo";
  test("creates successfully", () => {
    const stateController = new StateController();
    expect(stateController._collapses[key]).toBeUndefined();

    stateController.createCollapse(key, true);

    expect(stateController._collapses[key]).toBe(true);
  });

  test("collapse already exists", () => {
    const stateController = new StateController();
    stateController._collapses[key] = true;

    stateController.createCollapse(key, false);

    expect(stateController._collapses[key]).toBe(true);
  });

  test("does nothing if not ready", () => {
    const stateController = new StateController();
    stateController._state = StateControllerState.NoOp;

    stateController.createCollapse(key, true);

    expect(stateController._collapses[key]).toBeUndefined();
  });
});

describe("StateController - setCollapse tests", () => {
  const key = "foo";
  const stateController = new StateController();

  beforeEach(() => {
    stateController._state = StateControllerState.Ready;
    delete stateController._collapses[key];
  });

  test("sets successfully", () => {
    stateController.createCollapse(key);
    expect(stateController._collapses[key]).toBe(false);

    stateController.setCollapse(key, true);

    expect(stateController._collapses[key]).toBe(true);
  });

  test("does nothing if not initialized", () => {
    expect(stateController._collapses[key]).toBeUndefined();

    stateController.setCollapse(key, true);

    expect(stateController._collapses[key]).toBeUndefined();
  });

  test("does nothing is not ready", () => {
    stateController.createCollapse(key);
    expect(stateController._collapses[key]).toBe(false);
    stateController._state = StateControllerState.NoOp;

    stateController.setCollapse(key, true);

    expect(stateController._collapses[key]).toBe(false);
  });
});

describe("StateController - toggleCollapse tests", () => {
  const key = "foo";
  const stateController = new StateController();

  beforeEach(() => {
    stateController._state = StateControllerState.Ready;
    delete stateController._collapses[key];
  });

  test("toggles correctly", () => {
    stateController.createCollapse(key, true);
    expect(stateController.getCollapse(key)).toBe(true);

    stateController.toggleCollapse(key);

    expect(stateController.getCollapse(key)).toBe(false);
  });
});

describe("StateController - createPageGroup tests", () => {
  const groupKey = "foo";
  const stateController = new StateController();

  beforeEach(() => {
    stateController._state = StateControllerState.Ready;
    delete stateController._activePages[groupKey];
    delete stateController._pageGroups[groupKey];
  });

  test("creates successfully", () => {
    stateController.createPageGroup(groupKey);
    expect(stateController._pageGroups[groupKey]).toBeDefined();
  });
});

describe("StateController - createPage tests", () => {
  const groupKey = "foo";
  const pageKey = "bar";
  const stateController = new StateController();

  beforeEach(() => {
    stateController._state = StateControllerState.Ready;
    delete stateController._activePages[groupKey];
    delete stateController._pageGroups[groupKey];
  });

  test("creates successfully", () => {
    stateController.createPage(groupKey, pageKey, pageKey);

    const group = stateController._pageGroups[groupKey];

    expect(group).toBeDefined();
    expect(stateController._activePages[groupKey]).toBeDefined();

    expect(group.order.length).toBe(1);
    expect(group.pages[pageKey]).toBeDefined();
  });
});

describe("StateController - deletePage tests", () => {
  const groupKey = "foo";
  const pageKey = "bar";
  const stateController = new StateController();

  beforeEach(() => {
    stateController._state = StateControllerState.Ready;
    delete stateController._activePages[groupKey];
    delete stateController._pageGroups[groupKey];
  });

  test("deletes successfully", () => {
    stateController.createPage(groupKey, pageKey, pageKey);
    stateController.deletePage(groupKey, pageKey);

    const group = stateController._pageGroups[groupKey];

    expect(group).toBeDefined();
    expect(stateController._activePages[groupKey]).toBeUndefined();

    expect(group.order.length).toBe(0);
    expect(group.pages[pageKey]).toBeUndefined();
  });
});

describe("StateController - setActivePage tests", () => {
  const groupKey = "foo";
  const pageKey = "bar";
  const pageKey2 = "bloop";
  const stateController = new StateController();

  beforeEach(() => {
    stateController._state = StateControllerState.Ready;
    delete stateController._activePages[groupKey];
    delete stateController._pageGroups[groupKey];
  });

  test("creates successfully", () => {
    stateController.createPage(groupKey, pageKey, pageKey);
    stateController.createPage(groupKey, pageKey2, pageKey2);

    expect(stateController._activePages[groupKey]).toBe(pageKey);

    stateController.setActivePage(groupKey, pageKey2);

    expect(stateController._activePages[groupKey]).toBe(pageKey2);
  });
});
