import { Page } from "components/design";
import { Input, Select } from "components/style/forms";
import { Formik } from "formik";
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

function CharacterCard(props: CharacterCardProps) {
  props.character.campaign.name = "Endless Sea";
  props.character.ruleset.name = "Dungeons & Dragons, 5e";
  return (
    <Card>
      <Card.Body>
        <Row>
          <Col sm={4}>
            <img className="image-fluid" src={props.character.profile.src}/>
          </Col>
          <Col sm={8}>
            <h3>{props.character.name}</h3><br/>
            {props.character.campaign.name}<br/>
            {props.character.ruleset.name}<br/>
            <ButtonGroup>
              <Button>Duplicate</Button>
              <Button>Edit</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default function MyCharacters(props: MyCharactersProps) {
  const characterCards: JSX.Element[] = [];
  const rulesetOptions: JSX.Element[] = [
    <option key="_blank" value="">-- All Rulesets --</option>,
  ];

  props.characters.forEach((character: CharacterDocument) => {
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
