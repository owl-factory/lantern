import { Page } from ".";

// TODO - this might be removed for more specific layouts
export interface DynamicLayout {
  // The name of the layout
  name: string;
  // The name/key of the default page. If none, the first one will render
  defaultPageKey?: string;
  // The pages contained within this dynamic layout
  pages: Page[];

  // Whether or not this is a static layout
  isStatic: boolean;
}
