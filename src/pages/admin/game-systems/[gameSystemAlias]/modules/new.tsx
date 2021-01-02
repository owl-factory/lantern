import React from "react";
import Page from "../../../../../components/design/Page";
import Breadcrumbs from "../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import ModuleForm from "../../../../../components/admin/modules/Form";
import { GameSystem } from "../../../../../types/documents";

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown
 */
export function NewModuleForm(props: {gameSystem: GameSystem}): JSX.Element {
  const router = useRouter();
  return <ModuleForm
    initialValues={{
      name: "",
      alias: "",
    }}
    onSubmit={(values: any) => {}}
  />;
}

export default function NewModule({ gameSystem }: { gameSystem: GameSystem }): JSX.Element {
  return (
    <Page>
      <h1>New {gameSystem.name} Module</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", gameSystem.name || "", "New Module"]}/>
      <NewModuleForm gameSystem={gameSystem}/>
    </Page>
  );
}

NewModule.getInitialProps = async (ctx: NextPageContext) => {
  const alias = ctx.query.gameSystemAlias;

  return {
    gameSystem: {},
  };
};
