import GraphqlClient from "./graphqlClient";

export default class RealmsClient extends GraphqlClient {

  private accessToken: string = "";
  private accessTokenExpiry: Date;
  private refreshToken: string = "";

  constructor(url: string, headerOptions?: any) {
    super(url, headerOptions);
  }

  
}