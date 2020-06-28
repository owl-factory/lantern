/* eslint-disable @typescript-eslint/no-inferrable-types */

export default class Common {
  isActive: boolean = true;
  createdBy: string = "";
  editedBy?: string;
  deletedBy?: string;
  createdAt: number = Date.now();
  editedAt?: Date;
  deletedAt?: Date;
}