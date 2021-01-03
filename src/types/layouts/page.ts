import { Section } from ".";

export interface Page {
  // The name of the page. It may be used in tabs, if any
  name?: string;
  // The optional description of the page
  description?: string;
  // The sections contained within this page
  sections: Section[];
}