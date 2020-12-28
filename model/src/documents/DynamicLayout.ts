import { prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { Width } from "../models/Width";
import { CoreDocument } from "./CoreDocument";

/**
 * A section of a dynamic layout page. It divides up the page into columns and 
 * rows to group subsections together. 
 */
@ObjectType()
export class DynamicSection {
  // The name of a section. Used for keys (??) but would be useful for keeping track of
  // the purpose of a section
  @Field({ nullable: true })
  @prop()
  name?: string;

  // Similar to the name, only used for keeping track of a section's purpose
  @Field({ nullable: true })
  @prop()
  description?: string;

  // The responsive width of the section, allowing for responsiveness at different
  // screen widths
  @Field(() => Width)
  @prop({ required: true })
  w: Width;

  // The minimum height in em of a section. 
  @Field()
  @prop({ required: true })
  h: number;

  // A collection of IDs that make up the subsections 
  @Field()
  @prop({ required: true })
  subsections: string[];
}

/**
 * An object which describes a single page of layouts. 
 */
@ObjectType()
export class DynamicPage {
  // The name of a page. This is what may appear on a tab. It is not
  // necessary unless multiple pages are present
  @Field({ nullable: true })
  @prop()
  name?: string;

  // A description of the page, if desired. 
  @Field({ nullable: true })
  @prop()
  description?: string;

  // An array of all of the sections that divide up the page. 
  @Field(() => [DynamicSection])
  @prop({ required: true })
  sections: DynamicSection[];
}

/**
 * An object that instructs the layout renderer how to create a specific 
 * layout to populate with pre-set or editable variables. 
 */
@ObjectType()
export class DynamicLayout extends CoreDocument {
  // The name of the layout
  @Field()
  @prop({ required: true })
  name: string; 

  // The default page for the first page to render. If blank, the 
  // page will default to the first.
  @Field({ nullable: true })
  @prop()
  defaultPageKey?: string;
  
  // A list of all dynamicPage objects in the order that they will be rendered
  @Field(() => [DynamicPage])
  @prop({ required: true })
  pages: DynamicPage[];

  // Indicates if this page contains a form. 
  // TODO - change the name to something more understandable
  @Field()
  @prop({ required: true })
  isStatic: boolean;


  // Indicates that this layout may be pre-rendered, that is, it contains no
  // often-changing data from the database. This applies to search bars or 
  // content cards like spells
  @Field()
  @prop({ default: false })
  allowPrerendering: boolean;

  // Contains all of the subsection ids used within this layout. This is not 
  // submitted by the user, but rather generated when a layout is saved
  @Field()
  @prop({ required: true })
  containsSubsections: string[];

  // Contains a list of all components used in all the subsections with no
  // duplications. This ensures that we get all of the components we need in one
  // pull without needing to repeatedly call the database.
  @Field()
  @prop({ required: true })
  containsComponents: string[];
}