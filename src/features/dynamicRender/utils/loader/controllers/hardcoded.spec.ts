import {
  LoaderControllerState,
  MarkupSource,
} from "features/dynamicRender/types/controllers/loader";
import { HardcodedLoaderController } from "./hardcoded";
import { FactoryOptions } from "features/dynamicRender/types/factory";
import { safeMakeObservable } from "lib/mobx";
import { baseUrl } from "utils/environment";
import { Err } from "utils/results";

jest.mock("lib/mobx");

const FACTORY_OPTIONS = {
  markupSource: MarkupSource.Hardcoded,
  uri: baseUrl + "/characters/mockfinder.xml",
} as unknown as FactoryOptions;

describe("HardcodedLoaderController - constructor tests", () => {
  test("constructs correctly", () => {
    const controller = new HardcodedLoaderController(FACTORY_OPTIONS);
    expect(controller._state).toBe(LoaderControllerState.Initialized);
  });

  test("mobx error", () => {
    jest.mocked(safeMakeObservable).mockImplementationOnce(() => Err("crap"));
    const controller = new HardcodedLoaderController(FACTORY_OPTIONS);
    expect(controller._state).toBe(LoaderControllerState.MobxError);
  });

  test("bad options", () => {
    const controller = new HardcodedLoaderController({} as FactoryOptions);
    expect(controller._state).toBe(LoaderControllerState.InvalidOptions);
  });
});

describe("HardcodedLoaderController - fetch tests", () => {
  let controller: HardcodedLoaderController;

  beforeEach(() => {
    controller = new HardcodedLoaderController(FACTORY_OPTIONS);
    controller._state = LoaderControllerState.Ready;
  });

  test("successful fetch", async () => {
    global.window.fetch = jest.fn(
      async () =>
        ({
          ok: true,
          text: async () => "text",
        }) as Response
    );
    await controller.fetch();
    expect(controller._state).toBe(LoaderControllerState.Ready);
    expect(controller.markup).toBe("text");
  });
});
