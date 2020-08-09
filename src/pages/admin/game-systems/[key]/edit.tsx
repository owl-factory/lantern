import React from "react";
import Breadcrumbs from "../../../../components/design/Breadcrumbs";
import GameSystemForm from "../../../../components/admin/gameSystems/Form";
import Page from "../../../../components/design/Page";
import gql from "graphql-tag";
import { NextPageContext } from "next";
import GameSystemModel from "../../../../models/database/gameSystems";
import ThemeModel from "../../../../models/database/themes";
import { def } from "../../../../helpers/tools";

interface EditGameSystemProps {
  gameSystem: GameSystemModel;
  themes: ThemeModel[];
}

/**
 * Renders a the page to create a new game system
 * @param gameSystem The game system to be edited
 * @param themes The themes to render within the form
 */
function EditGameSystem({gameSystem, themes}: EditGameSystemProps) {
  // TODO - handle if gamesystem is empty
  const name = def<string>(gameSystem.name, "");
  return (
    <Page>
      <h1>Create Game System</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", name, "Edit"]}/>

      <br/>

      <GameSystemForm 
        initialValues={gameSystem}
        onSubmit={(values: GameSystemModel) => alert(JSON.stringify(values))}
        themes={themes}
      />
    </Page>
  );
}

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
