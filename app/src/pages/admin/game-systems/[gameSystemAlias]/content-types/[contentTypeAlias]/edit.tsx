import React from "react";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import ContentTypeForm from "../../../../../../components/admin/contentTypes/Form";
import Page from "../../../../../../components/design/Page";
import Breadcrumbs from "../../../../../../components/design/Breadcrumbs";
import { CommonContentType, ContentType, GameSystem } from "@reroll/model/dist/documents";
import { UpdateContentTypeInput } from "@reroll/model/dist/inputs";

interface EditContentTypeFormProps {
  commonContentTypes: CommonContentType[];
  contentType: ContentType;
}

interface EditContentTypeProps {
  commonContentTypes: CommonContentType[];
  contentType: ContentType;
  gameSystem: GameSystem;
}

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown
 */
export function EditContentTypeForm({ commonContentTypes, contentType }: EditContentTypeFormProps): JSX.Element {
  const router = useRouter();
  return <ContentTypeForm
    commonContentTypes={commonContentTypes}
    initialValues={contentType}
    onSubmit={(values: UpdateContentTypeInput) => {}}
  />;
}

/**
 * Renders a the page to create a new game system
 */
export default function EditContentType(
  { commonContentTypes, contentType, gameSystem }: EditContentTypeProps
): JSX.Element {
  return (
    <Page>
      <h1>Edit {contentType.name}</h1>
      <Breadcrumbs skipLevels={1} titles={[
        "Admin",
        "Game Systems",
        gameSystem.name,
        "Content Types",
        contentType.name,
        "Edit",
      ]}/>

      <br/>

      <EditContentTypeForm commonContentTypes={commonContentTypes} contentType={contentType}/>
    </Page>
  );
}


EditContentType.getInitialProps = async (ctx: NextPageContext) => {
  const { contentTypeAlias, gameSystemAlias } = ctx.query;

  return {
    commonContentTypes: [],
    contentType: {},
    gameSystem: {},
  };
};
