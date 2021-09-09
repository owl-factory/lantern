import { CampaignManager, CharacterManager, RulesetManager } from "client/data";
import { Page } from "components/design";
import { Loading } from "components/style";
import { Input, Select } from "components/style/forms";
import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import React from "react";
import { Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { InitialProps } from "types/client";
import { CampaignDocument, CharacterDocument, RulesetDocument } from "types/documents";
import { getSession } from "utilities/auth";
import { rest } from "utilities/request";

interface MyCharactersProps extends InitialProps {
  characters: CharacterDocument[];
  campaigns: CampaignDocument[];
  rulesets: RulesetDocument[];
}

interface SearchCharacterValues {
  search: string;
  ruleset: string;
}

interface CharacterCardProps {
  character: CharacterDocument;
}

const CharacterCard = observer((props: CharacterCardProps) => {
  return (
    <Card>
      <Card.Body>
        <Row>
          <Col sm={4}>
            <img className="image-fluid" src={props.character.profile.src}/>
          </Col>
          <Col sm={8}>
            <h3>{props.character.name}</h3><br/>
            {CampaignManager.get(props.character.campaign.id)?.name || <Loading/>}<br/>
            {RulesetManager.get(props.character.ruleset.id)?.name || <Loading/>}<br/>
            <ButtonGroup>
              <Button>Duplicate</Button>
              <Button>Edit</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
});

/**
 * Renders a page with the current user's characters
 * @param success Whether or not the initial props failed
 * @param message The success or error message indicating the error from the intial props
 * @param session The current user's session
 * @param characters The initial light campaign information fetched from the API
 */
export function MyCharacters (props: MyCharactersProps) {

  // Runs once on page instantiation
  React.useEffect(() => {
    // Loads in local storage data
    CharacterManager.load();
    CampaignManager.load();
    RulesetManager.load();

    CharacterManager.setMany(props.characters);

    // Fetches all missing campaigns and rulesets for the names
    const uniqueCampaigns = CharacterManager.getUniques("campaign.id");
    CampaignManager.fetchMissing(uniqueCampaigns);

    const uniqueRulesets = CharacterManager.getUniques("ruleset.id");
    RulesetManager.fetchMissing(uniqueRulesets);
  }, []);

  CharacterManager.setMany(props.characters);

  const characterCards: JSX.Element[] = [];

  // Loads all unique rulesets into the options
  const rulesetOptions: JSX.Element[] = [
    <option key="_blank" value="">-- All Rulesets --</option>,
  ];
  RulesetManager.getPage().forEach((ruleset: RulesetDocument) => {
    rulesetOptions.push(
      <option key={ruleset.id} value={ruleset.id}>{ruleset.name || <Loading/>}</option>
    );
  });

  CharacterManager.getPage().forEach((character: CharacterDocument) => {
    characterCards.push(<CharacterCard key={character.id} character={character}/>);
  });
  function searchCharacters(values: SearchCharacterValues) {
    // TODO - do something
  }
  return (
    <Page>
      <h1>My Characters</h1>
      <Formik
        initialValues={{
          search: "",
          ruleset: "",
        }}
        onSubmit={searchCharacters}
      >
        <div className="form-inline">
          <Input type="text" name="search" label="Search" placeholder="Search"/>
          <Select name="ruleset" label="Ruleset" >
            {rulesetOptions}
          </Select>
        </div>
      </Formik>
      {characterCards}
    </Page>
  );
}

interface MyCharactersResult {
  characters: CharacterDocument[];
  campaigns: CampaignDocument[];
  rulesets: RulesetDocument[];
}

MyCharacters.getInitialProps = async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  if (!session) {
    return {
      session: null,
      success: false,
      message: "You must be logged in to view your characters.",
      characters: [],
    };
  }

  const result = await rest.get<MyCharactersResult>(`/api/my-characters`);

  return {
    session,
    success: result.success,
    message: result.message,
    characters: result.data.characters,
    campaigns: result.data.campaigns,
  };
};

export default observer(MyCharacters);
