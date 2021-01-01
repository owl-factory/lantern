import React from "react";
import { useRouter } from "next/router";
import ModuleForm from "../../../../../../components/admin/modules/Form";
import Page from "../../../../../../components/design/Page";
import Breadcrumbs from "../../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import { GameSystem, Module } from "@reroll/model/dist/documents";
import { UpdateModuleInput } from "@reroll/model/dist/inputs";

interface EditModuleFormProps {
  gameSystem: GameSystem;
  module: Module;
}

interface EditModuleProps {
  gameSystem: GameSystem;
  module: Module
}

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown
 */
export function EditModuleForm(props: EditModuleFormProps): JSX.Element {
  const router = useRouter();
  return <ModuleForm
    initialValues={{
      name: props.module.name,
      alias: props.module.alias,
    }}
    onSubmit={(values: UpdateModuleInput) => {}}
  />;
}

export default function EditModule({ gameSystem, module }: EditModuleProps): JSX.Element {
  return (
    <Page>
      <h1>New {gameSystem.name} Module</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", gameSystem.name, "Modules" ]}/>
      <EditModuleForm gameSystem={gameSystem} module={module} />
    </Page>
  );
}

EditModule.getInitialProps = async (ctx: NextPageContext) => {
  const { gameSystemAlias, moduleAlias } = ctx.query;

  return {
    gameSystem: {},
    module: {},
  };
};
