import React from "react";
import Breadcrumbs from "../../../../components/design/Breadcrumbs";
import GameSystemForm from "../../../../components/admin/gameSystems/Form";
import Page from "../../../../components/design/Page";
import { client } from "../../../../helpers/graphql";
import gql from "graphql-tag";
import { NextPageContext } from "next";

export function EditGameSystemForm(props: any) {
  return <GameSystemForm 
    initialValues={props.gameSystem}
    onSubmit={(values: any) => alert(JSON.stringify(values))}
    themes={props.themes}
  />;
}

/**
 * Renders a the page to create a new game system
 */
function EditGameSystem({gameSystem, themes}: any) {
  return (
    <Page>
      <h1>Create Game System</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", gameSystem.name, "Edit"]}/>

      <br/>

      <EditGameSystemForm gameSystem={gameSystem} themes={themes}/>
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



EditGameSystem.getInitialProps = async (ctx: NextPageContext) => {
  const key = ctx.query.key;
  
  const query = gql`
  {
    gameSystems (key: "${key}") {
      id,
      name,
      description,
      isPurchasable,
      cost,
      theme
    },
    themes {
      id,
      name,
    }
  }`;

  // const { data, loading } = await client.query({query: query})
  return { 
    themes: [{"name": "Default", "id": "default"}],
    gameSystem: {
      name: "Dungeons and Dragons 5e",
      key: key,
      description: "The tabletop game we all love to play!",
      isPurchasable: false,
      cost: 0.00,
      theme: "default",
    }
  };
}

export default EditGameSystem;
