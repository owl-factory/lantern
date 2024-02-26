/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("lib/authentication/lucia").LuciaAuth;

  type DatabaseUserAttributes = {
    username: string;
    email: string;
    displayName?: string;
    iconUrl?: string;
    isOrganization: boolean;
    createdAt: Date;
    updatedAt: Date;
  };

  type DatabaseSessionAttributes = {
    isApiKey?: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}
