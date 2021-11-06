import { Client, query as q } from "faunadb";
import { makeAutoObservable } from "mobx";
import { CampaignDocument, ImageDocument } from "types/documents";
import { getClient } from "utilities/db";
import { rest } from "utilities/request";

/**
 * Manages the state and massive list of images, allowing for fast
 * and efficient management of them on the front end
 */
export class ImageController {
  public images: Record<string, ImageDocument> = {};
  public imageList: string[] = [];
  private ourCDNPrefex = "none";
  private client: Client;

  constructor() {
    this.client = getClient();
    makeAutoObservable(this);
  }

  /**
   * Fetches the initial collection of images from the server
   */
  public async fetchImages(): Promise<void> {
    const imageResponse = await rest.get(`/api/images`);
    if (!imageResponse.success) { return; }
    this.loadImages((imageResponse.data as any).images);
  }

  /**
   * Loads the images into the image manager
   * @param images The array of images to load into the image manager
   * @param startIndex The index to insert the images into, if doing multiple pages.
   */
  public loadImages(images: ImageDocument[], startIndex?: number): void {
    if (startIndex === undefined) {
      startIndex = this.imageList.length;
    }

    const newImageList: string[] = [];
    images.forEach((image: ImageDocument) => {
      this.images[image.id as string] = image;
      newImageList.push(image.id as string);
    });

    this.imageList = this.imageList.concat(newImageList);
  }

  /**
   * Saves a linked image to the database.
   * @param values The image values to save
   */
  public saveLinkedImage(values: ImageDocument): void {
    const tempID = "temp";
    values.id = tempID;
    this.images[tempID] = values;
    this.imageList.splice(0, 0, tempID);
    rest.put(`/api/images/external`, values as unknown as Record<string, unknown>)
    .then((res: any) => {
      if (res.success === false) {
        delete this.images[tempID];
        this.imageList = this.imageList.splice(0, 1);
        return;
      }

      this.images[res.data.image.id] = res.data.image;
      this.imageList[0] = res.data.image.id;
      delete this.images[tempID];

    });
  }

  /**
   * Adds an image to the top of the image list
   * @param image The image to add to the top of the image list
   */
  public add(image: ImageDocument) {
    this.images[image.id as string] = image;
    this.imageList.splice(0, 0, image.id as string);
  }

  /**
   * Handles the creation of a single image, sending it to the backend, and adding it to the image manager
   * @param image The image to create
   * @param method The method by which to create an image
   */
  public async createImage(image: ImageDocument, method: string) {
    if (!["link", "upload"].includes(method)) {
      Promise.reject(new Error("Method does not exist"));
      return;
    }
    const res = await rest.put(`/api/images`, { method, image }) as any;
    if (!res.success) {
      Promise.reject(new Error(res.message));
      return;
    }
    this.add(res.data.image);
    return;

  }

  /**
   * Runs all of the standard actions for setting an image in a document.
   * @param image The image to set and potentially save
   * @param method The method by which to set the image
   * @param url The API url we are sending the data to
   * @param allowedMethods The allowed methods used for setting the image
   */
  protected async setImage(
    image: ImageDocument,
    method: string,
    url: string,
    allowedMethods: string[] = ["list", "link", "upload"]
  ) {
    if (!allowedMethods.includes(method)) {
      Promise.reject(new Error("Method does not exist"));
      return;
    }

    const res = await rest.patch(url, { method, image }) as any;
    if (!res.success) {
      Promise.reject(new Error(res.message));
      return;
    }
    if (method !== "list") {
      this.add(res.data.image);
    }
    return res.data;
  }

  /**
   * Handles the creation and setting of a profile image
   * @param image The image to set as the new profile image
   * @param method The method to set the new profile image
   */
  public async setProfileImage(image: ImageDocument, method: string) {
    const result = await this.setImage(image, method, "/api/profile/images");
    return result.user;
  }

  /**
   * Runs the actions to set the banner image for a campaign
   * @param campaign The campaign to set the new banner for
   * @param image The image that we are setting and potentially creating
   * @param method The method that we are using to set the banner
   */
  public async setCampaignBanner(campaign: CampaignDocument, image: ImageDocument, method: string) {
    const result = await this.setImage(image, method, `/api/campaigns/${campaign.id}/banner`);
    return result.campaign;
  }
}
