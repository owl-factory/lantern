/* eslint-disable @typescript-eslint/ban-types */
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("lib/authentication").Auth;

  type DatabaseUserAttributes = {
    display_name: string;
    username: string;
    email: string;
    icon: string;
  };

  type DatabaseSessionAttributes = {
    display_name: string;
    username: string;
    email: string;
    icon: string;
  };
}
