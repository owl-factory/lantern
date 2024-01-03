import { action, observable, safeMakeObservable } from "lib/mobx";

/** Defines the different states of the StateController */
enum StateControllerState {
  /** No actions have been done on this StateController */
  NoOp,

  /** The state controller is ready to receive and serve data */
  Ready,

  /** An error occured with MobX */
  MobxError,
}

type PageGroup = {
  pages: Record<string, Page>;
  order: string[];
};

export type Page = {
  name: string;
  key: string;
};

/** A controller for managing the state of the Dynamic Render */
export class StateController {
  _state: StateControllerState = StateControllerState.NoOp;
  _collapses: Record<string, boolean> = {};
  _activePages: Record<string, string> = {};
  _pageGroups: Record<string, PageGroup> = {};

  constructor() {
    const mobxResult = safeMakeObservable(this, {
      _state: observable,
      setState: action,

      _collapses: observable,
      createCollapse: action,
      deleteCollapse: action,
      setCollapse: action,
      toggleCollapse: action,

      _activePages: observable,
      _pageGroups: observable,
      createPage: action,
      createPageGroup: action,
      deletePage: action,
      deletePageGroup: action,
      setActivePage: action,
    });

    if (mobxResult.ok === false) {
      this.setState(StateControllerState.MobxError);
      return this;
    }
    this.setState(StateControllerState.Ready);
  }

  /** Returns the ready state of this controller */
  get ready() {
    return this._state === StateControllerState.Ready;
  }

  /**
   * Sets the state of the current controller in a method trackable by MobX
   * @param state - The new state
   */
  setState(state: StateControllerState) {
    this._state = state;
  }

  /**
   * Ensures that a collapse value at the given key is present
   * @param key - The key of the collapse
   * @param defaultValue - The initial value to insert. False by default
   */
  createCollapse(key: string, defaultValue = false) {
    if (!this.ready) return;
    if (this._collapses[key] !== undefined) return;
    this._collapses[key] = defaultValue;
  }

  /**
   * Deletes a collapse from the state
   * @param key - The key of the collapse to remove
   */
  deleteCollapse(key: string) {
    delete this._collapses[key];
  }

  /**
   * Gets the current value of the collapse for the given key
   * @param key - The key of the collapse to get
   * @returns A boolean for the current state of the collapse key,
   *  undefined if not present or not ready
   */
  getCollapse(key: string): boolean | undefined {
    if (!this.ready) return undefined;
    return this._collapses[key];
  }

  /**
   * Sets the collapse to be a specific value
   * @param key - The key of the value to set
   * @param value - The new value to set
   */
  setCollapse(key: string, value: boolean) {
    if (!this.ready) return;
    // Do nothing if this collapse hasn't been initialized; prevents memory leaks
    if (this._collapses[key] === undefined) return;
    this._collapses[key] = value;
  }

  /**
   * Attempts to toggle the collapse value. Does nothing if the collapse does not exist
   * @param key - The collapse key to toggle
   */
  toggleCollapse(key: string) {
    if (!this.ready) return;
    const currentValue = this._collapses[key];
    if (currentValue === undefined) return;
    this._collapses[key] = !currentValue;
  }

  /**
   * Creates a Page Group for a given key
   * @param groupKey - The identifying key of the page group
   */
  createPageGroup(groupKey: string) {
    if (!this.ready) return;
    if (!groupKey) return;
    if (this._pageGroups[groupKey] !== undefined) return;
    this._pageGroups[groupKey] = { pages: {}, order: [] };
  }

  /**
   * Deletes a Page Group for a given key
   * @param groupKey - The identifying key of the page group
   */
  deletePageGroup(groupKey: string) {
    if (!this.ready) return;
    delete this._pageGroups[groupKey];
  }

  /**
   * Creates a page within the page group. If this is the first page or marked as default, it will be set as the opening page
   * @param groupKey - The identifying key of the page group
   * @param pageKey - The identifying key of a page
   * @param pageName - The title of the page within the group
   */
  createPage(groupKey: string, pageKey: string, pageName: string, makeDefaultPage = false) {
    if (!this.ready) return;
    if (!groupKey || !pageKey || !pageName) return;

    let group = this._pageGroups[groupKey];
    if (!group) {
      this.createPageGroup(groupKey);
      group = this._pageGroups[groupKey];
    }

    const page = group.pages[pageKey];
    if (page === undefined) {
      group.pages[pageKey] = { name: pageName, key: pageKey };
    }

    const isInList = group.order.includes(pageKey);
    if (!isInList) {
      group.order.push(pageKey);
    }

    if (makeDefaultPage) this._activePages[groupKey] = pageKey;
    const noActivePage = this._activePages[groupKey] === undefined;
    if (noActivePage) this._activePages[groupKey] = pageKey;
  }

  /**
   * Deletes a page from a page group. Sets a new active page if it is the current active page.
   * @param groupKey - The identifying key of the page group
   * @param pageKey - The identifying key of the page to delete
   */
  deletePage(groupKey: string, pageKey: string) {
    if (!this.ready) return;
    if (!groupKey || !pageKey) return;

    const group = this._pageGroups[groupKey];
    if (!group) return;

    delete group.pages[pageKey];
    group.order.filter((storedKey: string) => storedKey !== pageKey);

    const activePage = this._activePages[groupKey];
    const needNewActivePage = activePage === pageKey;
    if (!activePage || !needNewActivePage) return;

    const possibleNewPages = Object.keys(group.pages);
    if (possibleNewPages.length === 0) {
      delete this._activePages[groupKey];
      return;
    }

    this._activePages[groupKey] = possibleNewPages[0];
  }

  /**
   * Gets the active page key for the given page group key
   * @param groupKey - The identifying key of the page group
   * @returns The active pageKey, if found. Undefined if not present, or if not ready.
   */
  getActivePage(groupKey: string): string | undefined {
    if (!this.ready) return undefined;
    if (!groupKey) return;
    return this._activePages[groupKey];
  }

  /**
   * Sets an active page
   * @param groupKey - The identifying key of the page group
   * @param pageKey - The page key to set as the active page
   */
  setActivePage(groupKey: string, pageKey: string) {
    if (!this.ready) return undefined;
    if (!groupKey || !pageKey) return;
    const pages = this._pageGroups[groupKey]?.pages;
    if (!pages) return;

    if (pages[pageKey] === undefined) return;

    if (this._activePages[groupKey] === pageKey) return;
    this._activePages[groupKey] = pageKey;
  }

  /**
   * Gets information about a given page
   * @param groupKey - The identifying key of the page group
   * @param pageKey - The identifying key of the page to get information from
   */
  getPage(groupKey: string, pageKey: string): Page {
    if (!this.ready) return undefined;
    if (!groupKey || !pageKey) return undefined;
    const group = this._pageGroups[groupKey];
    if (!group) return undefined;
    return group[pageKey];
  }

  /**
   * Gets an ordered list of pages
   * @param groupKey - The identifying key of the page group
   * @returns An array of ordered pages
   */
  getPages(groupKey: string): Page[] {
    if (!this.ready) return [];
    if (!groupKey) return [];

    const group = this._pageGroups[groupKey];
    if (!group) return [];

    const pages = group.order.map((pageKey: string) => group.pages[pageKey]).filter((page: Page) => page !== undefined);
    return pages;
  }
}
