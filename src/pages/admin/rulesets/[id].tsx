import { RulesetManager } from "client/data";
import { Page } from "components/design";
import { Col } from "components/style";
import { Tooltip } from "components/style/tooltips";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import React from "react";
import { Card, Row } from "react-bootstrap";
import { MdInfo } from "react-icons/md";
import { isAdmin } from "server/logic/security";
import { InitialProps } from "types/client";
import { RulesetDocument } from "types/documents";
import { getSession } from "utilities/auth";
import { rest } from "utilities/request";

interface AdminRulesetProps extends InitialProps {
  ruleset: RulesetDocument;
}

function AdminRuleset(props: AdminRulesetProps) {
  const [ ruleset, setRuleset ] = React.useState(props.ruleset);

  React.useEffect(() => {
    RulesetManager.load();
    RulesetManager.set(props.ruleset);
  }, []);

  React.useEffect(() => {
    const newRuleset = RulesetManager.get(ruleset.id);
    if (!newRuleset) { return; }
    setRuleset(newRuleset);
  }, [RulesetManager.get(ruleset.id), RulesetManager.updatedAt]);

  return (
    <Page>
      <h1>{ruleset.name}</h1>
      <Card>
        <Card.Body>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <div><b>Status:</b></div>
            <div>{ruleset.isPublic ? "Public" : "Private"}</div>
            <div>{ruleset.isOfficial ? "Official" : "Community"}</div>
          </div>
        </Card.Body>
      </Card>

      <br/>

      <Row>
        <Col md={12} lg={6}>
          <Card>
            <Card.Body>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span style={{display: "inline"}}>
                  <h2>Content Types</h2>
                  <Tooltip
                    title="Content types describe the different types of static elements that are present
                    within a game. For example, they may be an Attack, a Spell, an Item, or a Proficiency."
                  >
                    <MdInfo/>
                  </Tooltip>
                </span>
                <span>Count: 6</span>
                <span>Open</span>
              </div>
            </Card.Body>
          </Card>
          <br/>
        </Col>

        <Col md={12} lg={6}>
          <Card>
            <Card.Body>
              <h2>Character Types</h2>
            </Card.Body>
          </Card>
          <br/>
        </Col>
      </Row>
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
