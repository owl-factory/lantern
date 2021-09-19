import { Page } from "components/design";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import React from "react";
import { isAdmin } from "server/logic/security";
import { InitialProps } from "types/client";
import { RulesetDocument } from "types/documents";
import { getSession } from "utilities/auth";
import { rest } from "utilities/request";

interface AdminRulesetProps extends InitialProps {
  ruleset: RulesetDocument;
}

function AdminRuleset(props: AdminRulesetProps) {
  return (
    <Page>
      <h1>{props.ruleset.name}</h1>
    </Page>
  );
}

interface AdminRulesetResult {
  ruleset: RulesetDocument[];
}

AdminRuleset.getInitialProps = async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  if (!session || !isAdmin(session.user)) { return {
    success: false,
    message: "You must be an admin to view this page.",
    session: session,
    rulesets: [],
  }; }

  const result = await rest.get<AdminRulesetResult>(`/api/rulesets/${ctx.query.id}`);
  return {
    session,
    success: result.success,
    message: result.message,
    ruleset: result.data.ruleset,
  };
};

export default observer(AdminRuleset);
