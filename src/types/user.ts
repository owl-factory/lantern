export interface User {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  email?: string;
  image?: string;
  roles?: string[];
}
