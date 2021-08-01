import { CampaignController } from "client/CampaignController";
import { Input, Modal, ModalBody, ModalHeader, Select } from "components/design";
import { Col, Row } from "components/style";
import { Formik, Form as FormikForm } from "formik";
import { observe } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { CampaignDocument } from "types/documents";
import styles from "./ListAllCampaigns.module.scss";

function howLongSince(date: Date) {
  return "A few seconds ago.";
}

interface NewCampaignModalProps {
  controller: CampaignController;
  open: boolean;
  closeModal: () => void;
}

/**
 * Renders a modal to create a new campaign. This modal will only be used to create a new campaign as the name
 * will be changed through other means and the game system will never change
 *
 * @param controller The campaign controller
 * @param open Boolean value. True if the campaign should be open
 * @param closeModal A function to close the modal
 */
function NewCampaignModal({ controller, open, closeModal }: NewCampaignModalProps) {
  return (
    <Modal open={open} handleClose={closeModal}>
      <ModalHeader>Create a New Campaign</ModalHeader>
      <ModalBody>
        <Formik
          initialValues={{
            name: "",
            gameSystemID: "",
          }}
          onSubmit={controller.createCampaign}
        >
          <FormikForm>
            <Input name="name"/>
            <Select name="gameSystemID" options={[]}/>
          </FormikForm>
        </Formik>
      </ModalBody>
    </Modal>
  );
}

interface CampaignThumbnailProps {
  campaign: CampaignDocument;
}

/**
 * Renders a campaign thumbnail, displaying the image, the name, and the last play time
 * TODO - include a list of players?
 * @param campaign The campaign to render out into a thumbnail
 */
function CampaignThumbnail({ campaign }: CampaignThumbnailProps): JSX.Element {
  return (
    <div className={styles.campaignThumbnail}>
      <img src={campaign.banner?.src}/>
      <span className={styles.name}>{campaign.name}</span><br/>
      <span className={styles.lastPlayed}>{howLongSince(campaign.lastPlayed as Date)}</span>
    </div>
  );
}

interface CampaignBoxProps {
  children: React.ReactChild | React.ReactChild[];
  onClick: () => void;
  isEmpty?: boolean;
}

/**
 * Renders a standard box for a campaign thumbnail to fit into
 * @param children The children to render within the box
 * @param onClick A function to run when the box is clicked
 * @param isEmpty Indicates if there is no campaign and that the box should be treated as empty
 */
function CampaignBox({ children, onClick, isEmpty }: CampaignBoxProps) {
  let className = styles.campaignBox;
  if (isEmpty) { className += ` ${styles.empty}`; }

  return (
    <Col xs={12} sm={6} md={6}  lg={3} xl={2}>
      <div className={className} onClick={onClick}>
        {children}
      </div>
    </Col>
  );
}

interface ListAllCampaignsProps {
  controller: CampaignController;
}

/**
 * Renders out a list of all campaigns
 * @param controller The campaign controller
 */
export const ListAllCampaigns = observer(({ controller }: ListAllCampaignsProps) => {
  const [ modal, setModal ] = React.useState(false);
  const campaigns: JSX.Element[] = [];
  controller.getCampaigns().forEach((campaign: CampaignDocument, index: number) => {
    campaigns.push(
      <CampaignBox key={`campaign_${index}`} onClick={() => console.log(campaign.id)}>
        <CampaignThumbnail campaign={campaign}/>
      </CampaignBox>
    );
  });
  campaigns.push(
    <CampaignBox key="_addCampaign" isEmpty={true} onClick={() => setModal(true)}>
      Add Campaign<br/>
      <MdAddCircleOutline/>
    </CampaignBox>
  );

  return (
    <Row>
      {campaigns}
      <NewCampaignModal open={modal} closeModal={() => setModal(false)} controller={controller}/>
    </Row>
  );
});