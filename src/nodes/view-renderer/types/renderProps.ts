import { ElementDescriptor } from "./elements";

export interface RenderProps<T> {
  renderID: string; // The ID of the render used to create the view
  element: ElementDescriptor<T>; // The descriptor of this element
  properties: any; // Information passed along by preceeding functions, such as the current index of a loop
}
