import { Dispatch, DispatchEvent } from "types";
import { CampaignLogic } from "server";
import { MessageModel } from "server/models";
import { MessageDoc } from "types";

export class PlayLogic {
  public static async handleFlush(
    myUserID: string,
    campaignID: string,
    dispatchHistory: Dispatch[]
  ) {
    const campaign = await CampaignLogic.fetchCampaign(myUserID, campaignID);
    if (!campaign) { throw { code: 404, message: "The campaign was not found." }; }

    const messages: MessageDoc[] = [];
    dispatchHistory.forEach((dispatch: Dispatch) => {
      switch(dispatch.event) {
        case DispatchEvent.Message:
          const message = dispatch.content;
          console.log(message);
          message.name = message.author;
          delete message.author;
          message.createdAt = (new Date()).setTime(dispatch.timestamp as number);
          message.campaignID = campaignID;
          // TODO - other handling in here
          messages.push(message);
      }
    });
    if (messages.length) {
      await MessageModel.insertMany(messages);
    }
  }
}