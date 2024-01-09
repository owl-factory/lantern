import { MarkupControllerState } from "features/dynamicRender/types/controllers/markup";
import { MarkupController } from "./common";
import { MarkupComponents } from "features/dynamicRender/utils/markup/parse";

describe("MarkupController - ready test", () => {
  let controller: MarkupController;
  beforeEach(() => {
    controller = new MarkupController();
  });
  test("controller is ready", () => {
    controller._state = MarkupControllerState.Ready;
    expect(controller.ready).toBe(true);
  });
});

describe("MarkupController - load tests", () => {
  let controller: MarkupController;
  beforeEach(() => {
    controller = new MarkupController();
    controller._state = MarkupControllerState.Initialized;
  });

  test("loads correctly", () => {
    controller.load();
    expect(controller._state).toBe(MarkupControllerState.WaitingOnData);
  });

  test("Fails to load", () => {
    controller._state = MarkupControllerState.NoOp;
    controller.load();
    expect(controller._state).toBe(MarkupControllerState.NoOp);
  });
});

describe("MarkupController - setData tests", () => {
  let controller: MarkupController;
  const components = { layout: {}, prefabs: {} } as MarkupComponents;
  beforeEach(() => {
    controller = new MarkupController();
    controller._state = MarkupControllerState.WaitingOnData;
  });

  test("sets data correctly", () => {
    controller.setData(components);
    expect(controller._layout).toBe(components.layout);
    expect(controller._prefabs).toBe(components.prefabs);
    expect(controller._state).toBe(MarkupControllerState.Ready);
  });

  test("fails to set data", () => {
    controller._state = MarkupControllerState.NoOp;
    controller.setData(components);
    expect(controller._layout).not.toBe(components.layout);
    expect(controller._prefabs).not.toBe(components.prefabs);
    expect(controller._state).toBe(MarkupControllerState.NoOp);
  });
});
