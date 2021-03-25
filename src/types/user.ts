export interface User {
  _id?: string; // TODO - we should resolve this to one ID field. @Lucy
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  email?: string;
  image?: string;
  roles?: string[];
}
