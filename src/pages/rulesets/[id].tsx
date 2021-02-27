import { NextPageContext } from "next";
import Error from 'next/error';
import React from "react";
import { Breadcrumbs, Page } from "../../components";
import { RulesetDoc } from "../../types";
import rest from "../../utilities/request";

interface RulesetPageProps {
  ruleset: RulesetDoc;
}

interface FetchRulesetData {
  ruleset: RulesetDoc;
}

/**
 * Renders the details of a ruleset
 * @param ruleset The ruleset to describe in this page
 */
function RulesetPage({ ruleset }: RulesetPageProps): JSX.Element {
  if (ruleset === undefined) { return <Page><Error statusCode={404}/></Page>; }
  return (
    <Page>
      <Breadcrumbs titles={["Rulesets", ruleset.name]}/>
      <h1>{ruleset.name}</h1>
    </Page>
  );
}

RulesetPage.getInitialProps = async (ctx: NextPageContext) => {
  const res = await rest.get<FetchRulesetData>(`/api/rulesets/${ctx.query.id}`);
  return { ruleset: res.data.ruleset || undefined };
};

export default RulesetPage;
