import { ElementDescriptor } from "./elements";

// Contains all of the information required for describing a View for rendering
export interface View {
  layout?: ElementDescriptor<unknown>[]; // Describes the general layout of the View
  prefabs?: Record<string, ElementDescriptor<unknown>[]>; // Describes the different prefabs usable within the render
  tabs?: Record<string, any>; // Describes the different pages and tabs that this view uses
  css?: string; // The transpiled CSS, ready for use in the browser

  // The metadata for managing a View
  renderCount: number; // How many times this is used in an active render
  cleanupID?: ReturnType<typeof setTimeout>; // The ID of the timeout function used for cleaning up this View
}
