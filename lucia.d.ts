/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("lib/authentication/lucia").LuciaAuth;

  type DatabaseUserAttributes = {
    username: string;
    email: string;
    displayName?: string; // display_name
    iconUrl?: string; // icon_url
  };

  type DatabaseSessionAttributes = {
    isApiKey?: boolean; // is_api_key
  };
}
