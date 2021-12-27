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
import { CharacterManager } from "controllers/data/character";
import { RulesetController, RulesetManager } from "controllers/data/ruleset";
import { CampaignCache } from "controllers/cache/CampaignCache";

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
            {CampaignCache.get(props.character.campaign.ref)?.name || <Loading/>}<br/>
            {RulesetManager.get(props.character.ruleset.ref)?.name || <Loading/>}<br/>
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
  const [characters, setCharacters] = React.useState<CharacterDocument[]>([]);
  const [rulesets, setRulesets] = React.useState<RulesetDocument[]>([]);

  CharacterManager.setMany(props.characters);

  // Loads in all data from the cache to the data managers
  React.useEffect(() => {
    // Loads in local storage data
    CharacterManager.load();
    RulesetManager.load();

    CharacterManager.setMany(props.characters);

    // Fetches all missing campaigns and rulesets for the names
    const uniqueCampaigns = CharacterManager.getUniques("campaign.ref");
    CampaignCache.readMissing(uniqueCampaigns);

    const uniqueRulesets = CharacterManager.getUniques("ruleset.ref");
    RulesetController.readMissing(uniqueRulesets);
  }, []);

  // Refreshes the characters to prevent too many rewrites
  React.useEffect(() => {
    setCharacters(CharacterManager.getPage());
  }, [CharacterManager]);

  // Refreshes the rulesets to prevent too many rewrites
  React.useEffect(() => {
    setRulesets(RulesetManager.getPage());
  }, [RulesetManager]);


  const characterCards: JSX.Element[] = [];

  // Loads all unique rulesets into the options
  const rulesetOptions: JSX.Element[] = [
    <option key="_blank" value="">-- All Rulesets --</option>,
  ];
  rulesets.forEach((ruleset: RulesetDocument) => {
    rulesetOptions.push(
      <option key={ruleset.ref} value={ruleset.ref}>{ruleset.name || <Loading/>}</option>
    );
  });

  characters.forEach((character: CharacterDocument) => {
    characterCards.push(<CharacterCard key={character.ref} character={character}/>);
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
