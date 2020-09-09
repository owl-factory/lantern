import React from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import GameSystemForm from "../../../components/admin/gameSystems/Form";
import Page from "../../../components/design/Page";
import { client } from "../../../utilities/graphql/pokemon";
import gql from "graphql-tag";
import ThemeModel from "../../../models/database/themes";

/**
 * @param themes Themes to render within the form's theme dropdown
 */
interface GameSystemFormProps {
  themes: ThemeModel[];
}

/**
 * @param themes Themes to render within the form's theme dropdown
 */
interface NewGameSystemProps {
  themes: ThemeModel[];
}

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown 
 */
export function NewGameSystemForm(props: GameSystemFormProps) {
  return <GameSystemForm 
    initialValues={{
      id: "",
      name: "",
      key: "",
      description: "",
      isPurchasable: false,
      cost: 0.00,
      defaultThemeID: undefined,
    }}
    onSubmit={(values: any) => alert(JSON.stringify(values))}
    themes={props.themes}
  />;
}

/**
 * Renders a the page to create a new game system
 * @param themes The themes to render within the new game system form
 */
function NewGameSystem({themes}: NewGameSystemProps) {
  return (
    <Page>
      <h1>Create Game System</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", "Create Game System"]}/>

      <br/>

      <NewGameSystemForm themes={themes}/>
    </Page>
  );
}

const fetchThemesGQL = gql`
{
  themes {
    id,
    name,
  }
}
`;

NewGameSystem.getInitialProps = async () => {
  // const { themes } = await client.query({query: fetchThemesGQL});
  return { themes: [{"name": "Default", "id": "default"}]};
}

export default NewGameSystem;
