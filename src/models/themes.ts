import Common from "./database/model";
import gql from "graphql-tag";
import Model from "./database/model";

interface Themes extends Model {
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

export function fetchAllThemes(): Themes[] {
  
  const fetchThemesGQL = gql`
  {
    themes {
      id,
      name,
    }
  }
  `;
  // const { themes } = await client.query({query: fetchThemesGQL});
  return [{"name": "Default", "id": "default"}];
}