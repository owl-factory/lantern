import "app/globals.css";
import { EnvironmentProvider } from "components/EnvironmentProvider";
import { GraphqlProvider } from "components/GraphqlProvider";
import { OfflineIndicator } from "components/OfflineIndicator";
import { getSessionId } from "lib/authentication";
import type { Metadata, Viewport } from "next";

const APP_NAME = "Lantern Tabletop";
const APP_DEFAULT_TITLE = "Welcome to Lantern Tabletop";
const APP_TITLE_TEMPLATE = "%s - Lantern Tabletop";
const APP_DESCRIPTION = "Lantern Tabletop is an open source online virtual tabletop for everyone.";

/**
 * NextJs special const export. These viewport fields are used by Next to automatically
 * generate `<meta>` viewport tags.
 */
export const viewport: Viewport = {
  themeColor: "#18181b",
};

/**
 * NextJs special const export. These metadata fields are used by Next to automatically
 * generate `<meta>` tags in the site `<head\>`.
 */
export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
};

/**
 * Root NextJS app layout component. All page routes will be wrapped by this component.
 * @param children - destructured react children prop.
 */
function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
      </head>
      <body className="h-full bg-backdrop text-white">
        <EnvironmentProvider authToken={getSessionId().unwrap()}>
          <GraphqlProvider>{children}</GraphqlProvider>
          <OfflineIndicator />
        </EnvironmentProvider>
      </body>
    </html>
  );
}

export default RootLayout;
