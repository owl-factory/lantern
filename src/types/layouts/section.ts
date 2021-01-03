import { Width } from ".";

// Describes how to create a specific section.
export interface Section {
  // The optional name of the section this object will render
  name?: string;
  // The optional description of the section this object will render
  description?: string;
  // The width object that describes the section width at various sizes
  w: Width;
  // The preview height in em for the section
  h: number;
  // The ids of subsections that we render to prevent duplicates
  subsections: string[];
}
