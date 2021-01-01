import React from "react";
import { useRouter } from "next/router";
import Page from "../../../../../components/design/Page";
import Breadcrumbs from "../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import ContentTypeForm from "../../../../../components/admin/contentTypes/Form";
import { CommonContentType, GameSystem } from "@reroll/model/dist/documents";
import { CreateContentTypeInput } from "@reroll/model/dist/inputs";

interface NewContentTypeFormProps {
  commonContentTypes: CommonContentType[];
  gameSystem: GameSystem;
}

interface NewCommonContentTypeProps {
  commonContentTypes: CommonContentType[];
  gameSystem: GameSystem;
}

/**
 * Renders a new game system form
 */
export function NewContentTypeForm({ commonContentTypes, gameSystem }: NewContentTypeFormProps): JSX.Element {
  const router = useRouter();
  return <ContentTypeForm
    commonContentTypes={commonContentTypes}
    initialValues={{
      name: "",
      alias: "",
    }}
    onSubmit={(values: CreateContentTypeInput) => {}}
  />;
}

/**
 * Renders a the page to create a new game system
 */
export default function NewCommonContentType(
  {commonContentTypes, gameSystem }: NewCommonContentTypeProps
): JSX.Element {
  return (
    <Page>
      <h1>Create Content Type</h1>
      <Breadcrumbs skipLevels={1} titles={[
        "Admin",
        "Game Systems",
        gameSystem.name,
        "Content Types",
        "New",
      ]}/>

      <br/>

      <NewContentTypeForm commonContentTypes={commonContentTypes} gameSystem={gameSystem}/>
    </Page>
  );
}


NewCommonContentType.getInitialProps = async (ctx: NextPageContext) => {
  const alias = ctx.query.gameSystemAlias;

  return {
    commonContentTypes: [],
    gameSystem: {},
  };
};
