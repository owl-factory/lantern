import { Session } from "./user";

export interface InitialProps {
  session: Session;
  success: boolean;
  message: string;
}
