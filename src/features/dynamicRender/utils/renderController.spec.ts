import { safeMakeObservable } from "lib/mobx";
import { RenderController, RenderControllerState } from "./renderController";
import { LoaderFactory, MarkupFactory, StorageFactory } from "./factory";
import { Err } from "utils/results";
import { FactoryOptions } from "features/dynamicRender/types/factory";
import { GetOptions, QuerySource } from "features/dynamicRender/types/query";
import { parseMarkup } from "features/dynamicRender/utils/markup/parseSheet";

jest.mock("lib/mobx");
jest.mock("./factory");
jest.mock("./markup/parseSheet");

const OPTIONS = {} as FactoryOptions;

describe("renderController constructor tests", () => {
  beforeEach(() => {
    jest.mocked(safeMakeObservable).mockClear();
    jest.mocked(LoaderFactory.build).mockClear();
    jest.mocked(MarkupFactory.build).mockClear();
    jest.mocked(StorageFactory.build).mockClear();
  });

  test("no options", () => {
    new RenderController();
    expect(safeMakeObservable).not.toHaveBeenCalled();
    expect(LoaderFactory.build).not.toHaveBeenCalled();
    expect(MarkupFactory.build).not.toHaveBeenCalled();
    expect(StorageFactory.build).not.toHaveBeenCalled();
  });

  test("mobx is unsafe", () => {
    jest.mocked(safeMakeObservable).mockImplementationOnce(() => Err("oh no."));
    const res = new RenderController(OPTIONS);
    expect(res._state).toBe(RenderControllerState.MobxError);
    expect(safeMakeObservable).toHaveBeenCalled();
  });

  test("constructs successfully", () => {
    const res = new RenderController(OPTIONS);

    expect(res._state).toBe(RenderControllerState.Initialized);
    expect(safeMakeObservable).toHaveBeenCalled();
    expect(LoaderFactory.build).toHaveBeenCalled();
    expect(MarkupFactory.build).toHaveBeenCalled();
    expect(StorageFactory.build).toHaveBeenCalled();
  });
});

describe("RenderController - ready tests", () => {
  const renderController = new RenderController(OPTIONS);

  test("state is ready", () => {
    renderController._state = RenderControllerState.Ready;
    const res = renderController.ready;
    expect(res).toBe(true);
  });

  test("state is not ready", () => {
    renderController._state = RenderControllerState.MobxError;
    const res = renderController.ready;
    expect(res).toBe(false);
  });
});

describe("RenderController - load tests", () => {
  const renderController = new RenderController(OPTIONS);

  beforeEach(() => {
    renderController._state = RenderControllerState.Initialized;
    jest.mocked(renderController.loader.load).mockClear();
    jest.mocked(renderController.markup.load).mockClear();
    jest.mocked(renderController.markup.setData).mockClear();
    jest.mocked(renderController.storage.load).mockClear();
  });

  test("not in initialized state", () => {
    renderController._state = RenderControllerState.NoOp;

    renderController.load();

    expect(renderController.loader.load).not.toHaveBeenCalled();
    expect(renderController.markup.load).not.toHaveBeenCalled();
    expect(renderController.storage.load).not.toHaveBeenCalled();
  });

  test("markup is not valid", async () => {
    renderController._state = RenderControllerState.Initialized;
    jest.mocked(parseMarkup).mockImplementationOnce(() => Err("crap!"));

    await renderController.load();

    expect(parseMarkup).toHaveBeenCalled();
    expect(renderController._state).toBe(RenderControllerState.ParsingError);
  });

  test("markup is valid", async () => {
    await renderController.load();

    expect(renderController.markup.setData).toHaveBeenCalled();
    expect(renderController._state).toBe(RenderControllerState.Ready);
  });
});

describe("RenderController - get tests", () => {
  const renderController = new RenderController(OPTIONS);
  beforeEach(() => {
    jest.mocked(renderController.storage.get).mockClear();
  });

  test("invalid query source", () => {
    const options: GetOptions = { source: QuerySource.Invalid };

    const res = renderController.get(options);

    expect(res).toBeUndefined();
  });

  test("get character", () => {
    const options: GetOptions = { source: QuerySource.Character, key: "hello" };
    const res = renderController.get(options);
    expect(renderController.storage.get).toHaveBeenCalled();
    expect(res).toBeDefined();
  });
});
