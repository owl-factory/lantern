import { absoluteGraphqlEndpoint } from "utils/environment";

const staticHtml = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>GraphQL Sandbox - Lantern Tabletop</title>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
        }
        #embedded-sandbox {
          height: 100%;
          overflow-y: hidden;
        }
      </style>
    </head>
    <body>
      <div id="embedded-sandbox"></div>
      <script src="https://embeddable-sandbox.cdn.apollographql.com/_latest/embeddable-sandbox.umd.production.min.js"></script>
      <script>
        new window.EmbeddedSandbox({
          target: "#embedded-sandbox",
          initialEndpoint: "${absoluteGraphqlEndpoint}",
          hideCookieToggle: false,
          endpointIsEditable: false,
          initialState: {
            includeCookies: true,
          },
        });
      </script>
    </body>
  </html>
`;

/**
 * Handler that returns plain HTML for the embeded Apollo Sandbox.
 */
export async function sandboxHandler() {
  return new Response(staticHtml, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
}
