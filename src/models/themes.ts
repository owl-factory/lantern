import Common from "./common";
import gql from "graphql-tag";

interface Themes extends Common {
  name: string;
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