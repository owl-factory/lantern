import React from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import GameSystemForm from "../../../components/admin/gameSystems/Form";
import Page from "../../../components/design/Page";
import { client } from "../../../helpers/graphql";
import gql from "graphql-tag";

export function NewGameSystemForm(props: any) {
  return <GameSystemForm 
    initialValues={{
      name: "",
      key: "",
      description: "",
      isPurchasable: false,
      cost: 0.00,
      theme: null,
    }}
    onSubmit={(values: any) => alert(JSON.stringify(values))}
    themes={props.themes}
  />;
}

/**
 * Renders a the page to create a new game system
 */
function NewGameSystem({themes}: any) {
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
