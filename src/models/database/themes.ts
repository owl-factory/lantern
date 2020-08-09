import Model from "./model";

/**
 * Defines the structure of the Theme objects
 * @param name The name of the theme
 * @param description A brief description of the theme
 * @param isDefaultTheme Boolean. True if this is the default theme, false otherwise
 * @param primaryColor A string defining the hex code for the primary color
 * @param secondaryColor A string defining the hex code for the secondary color
 * @param tertiaryColor A string defining the hex code for the tertiary color
 * @param backgroundColor A string defining the hex code for the background color
 * @param rawSCSS The raw SCSS that may be edited
 * @param themeLocation The location that the compiled theme CSS may be found
 */
export default interface ThemeModel extends Model {
  name?: string;
  description?: string;
  isDefaultTheme?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  backgrounColor?: string;
  rawSCSS?: string;
  themeLocation?: string;
}
