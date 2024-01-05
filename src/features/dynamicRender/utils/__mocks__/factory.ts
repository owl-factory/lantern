import { LoaderController } from "features/dynamicRender/utils/loader/controllers/common";
import { MarkupController } from "features/dynamicRender/utils/markup/controllers/common";

export class LoaderFactory {
  static build = jest.fn(() => new TestLoaderController());
}

export class TestLoaderController extends LoaderController {
  _ready = true;
  get ready() {
    return this._ready;
  }
  fetch = jest.fn();
  load = jest.fn();
  setState = jest.fn();
}

export class MarkupFactory {
  static build = jest.fn(() => new TestMarkupController());
}

export class TestMarkupController extends MarkupController {
  _ready = true;
  get ready() {
    return this._ready;
  }
  load = jest.fn();
  prefab = jest.fn();
  setData = jest.fn();
  setState = jest.fn();
}

export class StorageFactory {
  static build = jest.fn(() => new TestStorageController());
}

export class TestStorageController {
  _ready = true;
  get ready() {
    return this._ready;
  }
  get = jest.fn(() => "test value");
  load = jest.fn();
  setState = jest.fn();
  update = jest.fn(() => true);
}
