import { Client, query as q } from "faunadb";
import { makeAutoObservable } from "mobx";
import { ImageDocument } from "types/documents";
import { FaunaRef } from "types/fauna";
import { getClient } from "utilities/db";
import { buildRef, mapFauna } from "utilities/fauna";
import { rest } from "utilities/request";

/**
 * Manages the state and massive list of images, allowing for fast
 * and efficient management of them on the front end
 */
export class ImageManager {
  public images: Record<string, ImageDocument> = {};
  public imageList: string[] = [];
  private ourCDNPrefex = "none";
  private client: Client;

  constructor() {
    this.client = getClient();
    makeAutoObservable(this);
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
   * Deletes a single image and removes it from the ImageManager
   * @param index The index of the image within the imageList to delete. Used over
   * the ID so that we can quickly reference the array and remove it everywhere in
   * as short a time as possible
   */
  public async deleteImage(index: number): Promise<void> {
    if (!this.imageList[index] || !this.images[this.imageList[index]]) { throw "The image to delete does not exist."; }
    const image = this.images[this.imageList[index]];
    if (this.isExternal(image)) {
      this.client.query(q.Delete(image.ref as FaunaRef));
    } else {
      rest.delete(`/api/images/${image.id}`, {});
    }
    delete this.images[this.imageList[index]];
    this.imageList.splice(index, 1);
  }

  public async fetchImage(imageID: string ): Promise<ImageDocument> {
    if (!this.images[imageID]) { return {}; }
    if (this.images[imageID].ownedBy !== undefined) { return this.images[imageID]; }
    this.images[imageID] = mapFauna(
      await this.client.query(q.Get(buildRef(imageID, this.images[imageID].collection as string)))
    ) as ImageDocument;
    return this.images[imageID];
  }

  public getImage(imageID: string): ImageDocument {
    if (!this.images[imageID]) { return {}; }
    if (this.images[imageID].ownedBy !== undefined) { return this.images[imageID]; }
    this.fetchImage(imageID);
    return this.images[imageID];
  }

  /**
   * Checks if an image is external without a database call. If unknown, return false
   * @param image The image to determine if external or not
   */
  public isExternal(image: ImageDocument): boolean {
    if (image.isExternal) { return true; }
    if (image.src && image.src.includes(this.ourCDNPrefex)) { return false; }
    return true;
  }
}
