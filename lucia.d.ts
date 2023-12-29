/* eslint-disable @typescript-eslint/ban-types */
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("lib/authentication").Auth;

  type DatabaseUserAttributes = {
    username: string;
    email: string;
    display_name: string | null;
    icon_url: string | null;
  };

  type DatabaseSessionAttributes = {
    username: string;
    email: string;
    display_name: string | null;
    icon_url: string | null;
  };
}
