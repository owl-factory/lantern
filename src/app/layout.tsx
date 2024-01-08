import "app/globals.css";
import type { Metadata, Viewport } from "next";

const APP_NAME = "Lantern Tabletop";
const APP_DEFAULT_TITLE = "Welcome to Lantern Tabletop";
const APP_TITLE_TEMPLATE = "%s - Lantern Tabletop";
const APP_DESCRIPTION = "Lantern Tabletop is an open source online virtual tabletop for everyone.";

export const viewport: Viewport = {
  themeColor: "#18181b",
};

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
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}

export default RootLayout;
