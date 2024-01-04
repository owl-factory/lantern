import { LoaderControllerState } from "features/dynamicRender/types/controllers/loader";
import { LoaderController } from "./common";

class TestLoaderController extends LoaderController {
  fetch = jest.fn(async () => this.setState(LoaderControllerState.Ready));
}

describe("LoaderController - load tests", () => {
  let controller: TestLoaderController;
  beforeEach(() => {
    controller = new TestLoaderController();
    controller._state = LoaderControllerState.Initialized;
  });

  test("load correctly", async () => {
    await controller.load();
    expect(controller._state).toBe(LoaderControllerState.Ready);
  });

  test("fails to load", async () => {
    controller._state = LoaderControllerState.NoOp;
    await controller.load();
    expect(controller._state).toBe(LoaderControllerState.NoOp);
  });
});
