import { action, makeObservable, observable } from "mobx";

interface SheetPage {
  name: string;
  access: string;
  children: HTMLCollection;
}


export class SheetRenderController {
  protected xml!: Document;
  public pages: SheetPage[] = [];
  protected prefabs: Record<string, unknown> = {};

  constructor(xml?: Document | null) {
    if (!xml) { return; }
    this.load(xml);

    makeObservable(this, {
      pages: observable,
      load: action,
      loadPages: action,
    });
  }

  public load(xml: Document) {
    this.xml = xml;
    this.loadPages();
  }

  public loadPages(): void {
    const pageElements = this.xml.getElementsByTagName("Page");

    if (pageElements.length === 0) { throw `At least one Page element must exist within the Sheet element`; }

    for (const pageElement of pageElements) {
      const name = pageElement.getAttribute("name");
      const access = pageElement.getAttribute("access") || "public";

      if (name === null) { throw `The attribute "name" is required in the Page element`; }
      // TODO - is valid access
      this.pages.push({
        name, access, children: pageElement.children,
      });
    }
  }
}
