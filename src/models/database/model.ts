/* eslint-disable @typescript-eslint/no-inferrable-types */

export default interface Model {
  id: string;
  isActive?: boolean;
  createdBy?: string;
  editedBy?: string;
  deletedBy?: string;
  createdAt?: number;
  editedAt?: Date;
  deletedAt?: Date;
}