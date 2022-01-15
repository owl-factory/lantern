import { Page } from "components/design";
import { Button } from "@owl-factory/components/button";
import { Loading } from "@owl-factory/components/loading";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import React from "react";
import { ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { InitialProps } from "types/client";
import { CampaignDocument, CharacterDocument, RulesetDocument } from "types/documents";
import { getSession } from "@owl-factory/auth/session";
import { rest } from "@owl-factory/https/rest";
import { CampaignCache } from "controllers/cache/CampaignCache";
import { CharacterCache } from "controllers/cache/CharacterCache";
import { RulesetCache } from "controllers/cache/RulesetCache";
import { Modal } from "@owl-factory/components/modal";
import { NewCharacterForm } from "components/reroll/characters/NewCharacterForm";
import { PassiveReadLevel } from "@owl-factory/cache/enums";
import { CharacterSheet } from "components/reroll/characters/character-sheet/CharacterSheet";
import { Ref64 } from "@owl-factory/types";
import { getUniques } from "@owl-factory/utilities/arrays";

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
  character: Partial<CharacterDocument>;
}

/**
 * 
 * @returns 
 */
const CharacterList = observer((props: any) => {
  const [ characters, setCharacters ] = React.useState<Partial<CharacterDocument>[]>([]);
  const characterElements: JSX.Element[] = [];

  React.useEffect(() => {
    const cachedCharacters = CharacterCache.getPage();
    setCharacters(cachedCharacters);
  }, [CharacterCache.lastTouched]);

  characters.forEach((character: Partial<CharacterDocument>) => {
    characterElements.push(
      <div key={character.ref} onClick={() => props.onClick(character.ref)}>
        {character.name}
        <span style={{float: "right"}} onClick={() => CharacterCache.delete(character.ref)}>X</span>
      </div>
    );
  });

  return (
    <>{characterElements}</>
  );
});


const CharacterCard = observer((props: CharacterCardProps) => {
  return (
    <Card>
      <Card.Body>
        <Row>
          <Col sm={4}>
            <img className="image-fluid" src={props.character.profile?.src}/>
          </Col>
          <Col sm={8}>
            <h3>{props.character.name}</h3><br/>
            {CampaignCache.get(props.character.campaign?.ref)?.name || <Loading/>}<br/>
            {RulesetCache.get(props.character.ruleset?.ref)?.name || <Loading/>}<br/>
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
  const [ open, setOpen ] = React.useState(false);
  const [ activeCharacter, setActiveCharacter ] = React.useState<string | undefined>(undefined);
  const [rulesets, setRulesets] = React.useState<Partial<RulesetDocument>[]>([]);

  function setActive(ref: Ref64) {
    setActiveCharacter(ref);
  }

  function closeModal() {
    // Do other things, like clear out the modal form content
    setOpen(false);
  }

  // Loads in all data from the cache to the data managers
  React.useEffect(() => {
    CharacterCache.setMany(props.characters);

    // Fetches all missing campaigns and rulesets for the names
    const uniqueCampaigns = getUniques(props.characters, "campaign.ref");
    CampaignCache.readMissing(uniqueCampaigns);

    const uniqueRulesets = getUniques(props.characters, "ruleset.ref");
    RulesetCache.readMissing(uniqueRulesets);
  }, []);

  // Refreshes the rulesets to prevent too many rewrites
  React.useEffect(() => {
    setRulesets(RulesetCache.getPage());
  }, [RulesetCache]);


  const characterCards: JSX.Element[] = [];

  // Loads all unique rulesets into the options
  const rulesetOptions: JSX.Element[] = [
    <option key="_blank" value="">-- All Rulesets --</option>,
  ];
  rulesets.forEach((ruleset: Partial<RulesetDocument>) => {
    rulesetOptions.push(
      <option key={ruleset.ref} value={ruleset.ref}>{ruleset.name || <Loading/>}</option>
    );
  });

  function searchCharacters(values: SearchCharacterValues) {
    // TODO - do something
  }
  return (
    <Page>
      <h1>My Characters</h1>
      {/* <Formik
        initialValues={{
          search: "",
          ruleset: "",
        }}
        onSubmit={searchCharacters}
      >
        <Input type="text" name="search" label="Search" placeholder="Search"/>
        <Select name="ruleset" label="Ruleset" >
          {rulesetOptions}
        </Select>
      </Formik> */}

      {/* {characterCards} */}

      <div>
        Various Tool Stuff for Characters<br/>
        <Button onClick={() => setOpen(true)}>New Character</Button>
      </div>

      <div className="row">
        <div className="col-12 col-md-4">
          List of Characters
          <hr/>
          <CharacterList onClick={setActive}/>
        </div>

        <div className="d-none d-md-block col-md-8">
          Character Sheet
          <hr/>
          <CharacterSheet activeCharacter={activeCharacter}/>
        </div>
      </div>

      <Modal open={open} handleClose={closeModal}>
        <div className="modal-header">
          New Character
        </div>

        <div className="modal-body">
          <NewCharacterForm/>
        </div>
      </Modal>
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
