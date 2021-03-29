import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { Query } from "mongoose";
import { UserProfileModel } from "server";
import { UserProfileDoc } from "types";

export class UserProfileLogic {
  public static async fetchList(userIDs: string[]): Promise<UserProfileDoc[]> {
    const userProfiles = await (
      UserProfileModel.find()
      .and([{ _id: { $all: userIDs }}])
    );

    return userProfiles;
  }

  public static async fetchProfile(myUserID: string) {
    return await UserProfileModel.findById(myUserID);
  }

  public static async saveUserProfile(myUserID: string, profile: any): Promise<Query<any> & BeAnObject> {
    const newProfile = UserProfileModel.updateOne({_id: myUserID}, {_id: myUserID, ...profile} , { upsert: true });
    return newProfile;
  }

  public static async createDefaultProfile(myUserID: string): Promise<void> {
    this.saveUserProfile(myUserID, {
      name: "Unknown :O",
    });
  }
}
