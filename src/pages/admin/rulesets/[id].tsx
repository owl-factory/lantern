import { Page } from "components/design";
import { Col } from "@owl-factory/components/flex";
import { Tooltip } from "@owl-factory/components/tooltip";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import React from "react";
import { Card, Row } from "react-bootstrap";
import { MdInfo } from "react-icons/md";
import { InitialProps } from "types/client";
import { RulesetDocument } from "types/documents";
import { rest } from "@owl-factory/https/rest";
import { getSession } from "@owl-factory/auth/session";
import { getRulesets } from "src/pages/api/rulesets/[id]";
import { handleAPI } from "@owl-factory/https/apiHandler";

interface AdminRulesetProps extends InitialProps {
  ruleset: RulesetDocument;
}

/**
 * Renders a single ruleset for admins to view and update
 * @param success Whether or not the initial props failed
 * @param message The success or error message indicating the error from the intial props
 * @param session The current user's session
 * @param ruleset The initial detailed ruleset information fetched from the API
 */
function AdminRuleset(props: AdminRulesetProps) {
  const [ ruleset, setRuleset ] = React.useState<Partial<RulesetDocument>>(props.ruleset);

  // Loads the cached data in and updates with the details from the API
  React.useEffect(() => {
    RulesetData.set(props.ruleset);
  }, [props.ruleset]);

  const newRuleset = RulesetData.get(ruleset.ref as string);
  // Updates the ruleset when something in the ruleset manager is updated
  React.useEffect(() => {
    if (!newRuleset) { return; }
    setRuleset(newRuleset);
  }, [newRuleset]);

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

export async function getServerSideProps(ctx: NextPageContext) {
  return await handleAPI(ctx, getRulesets);
}

export default observer(AdminRuleset);
