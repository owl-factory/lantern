import { NextPageContext } from "next";
import React from "react";
import { Page } from "../../components";
import { Fields } from "../../components/reroll/rulesets/Fields";
import { ContentTypeDoc, RulesetDoc } from "../../types";
import { rest } from "../../utilities";

interface ContentTypePageProps {
  initialContentType: ContentTypeDoc;
  ruleset: RulesetDoc;
}



export function ContentTypePageProps({ initialContentType, ruleset }: ContentTypePageProps): JSX.Element {
  const [ contentType, setContentType ] = React.useState(initialContentType);
  const [ fields, setFields ] = React.useState(initialContentType.fields || {
    test: { name: "Test", key: "test", type: 0 },
  });

  return (
    <Page>
      <h1>{contentType.name}</h1>
      <a href={`/rulesets/${ruleset._id}`}>&lt; {ruleset.name}</a>

      <br/><br/>
      <Fields fields={fields} setFields={setFields}/>
    </Page>
  );
}

ContentTypePageProps.getInitialProps = async (ctx: NextPageContext) => {
  const res = await rest.get<any>(`/api/pages/content-types/${ctx.query.id}`);

  return {
    initialContentType: res.data.contentType,
    ruleset: res.data.ruleset,
  };
};

export default ContentTypePageProps;
