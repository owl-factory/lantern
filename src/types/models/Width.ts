import { prop } from "@typegoose/typegoose";

// TODO - bump these up to a max width of 24
type WidthOptions = 12 | 8 | 6 | 4 | 3 | 2 | 1;


/**
 * An object that describes the width of an dynamic layout object
 * in terms of 12 or 24 segments
 */
export class Width {
  @prop({ required: true })
  xs!: WidthOptions;

  @prop()
  sm?: WidthOptions;

  @prop()
  md?: WidthOptions;

  @prop()
  lg?: WidthOptions;

  @prop()
  xl?: WidthOptions;
}
