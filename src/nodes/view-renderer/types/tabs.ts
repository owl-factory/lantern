export interface Tab {
  index: number;
  name: string;
}
export type Tabs = Record<string, Tab>;
export type TabGroups = Record<string, Tabs>;
