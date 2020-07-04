<<<<<<< HEAD
import Common from "./database/model";
import gql from "graphql-tag";
import Model from "./database/model";

interface Themes extends Model {
  name?: string;
=======
import Common from "./common";
import gql from "graphql-tag";

interface Themes extends Common {
  name: string;
>>>>>>> bc4cabd... Adds the index and edit pages for a specific gamesystem. Builds the index page framework
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