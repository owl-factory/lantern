/* eslint-disable @typescript-eslint/ban-types */
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("lib/authentication").Auth;

  type DatabaseUserAttributes = {
    username: string;
    email: string;
    display_name?: string;
    icon_url?: string;
  };

  type DatabaseSessionAttributes = {
    username: string;
    email: string;
    display_name?: string;
    icon_url?: string;
  };
}
