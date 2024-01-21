import { MarkupControllerState } from "features/dynamicRender/types/controllers/markup";
import { StaticMarkupController } from "./static";
import { safeMakeObservable } from "lib/mobx";
import { Err } from "utils/results";

jest.mock("lib/mobx");

describe("StaticMarkupController - constructor tests", () => {
  test("constructs successfully", () => {
    const controller = new StaticMarkupController();
    expect(controller._state).toBe(MarkupControllerState.Initialized);
  });

  test("mobx fails", () => {
    jest.mocked(safeMakeObservable).mockImplementationOnce(() => Err("crap"));
    const controller = new StaticMarkupController();
    expect(controller._state).toBe(MarkupControllerState.MobxError);
  });
});
