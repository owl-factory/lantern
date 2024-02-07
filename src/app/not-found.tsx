import { LanternLogo } from "components/LanternLogo";
import { Metadata } from "next";
import { Link } from "components/ui/Link";
import { absoluteGraphqlUrl } from "utils/environment";

/**
 * Page metadata object, NextJs will append these values as meta tags to the <head>.
 */
export const metadata: Metadata = {
  title: "Welcome",
  description: "Welcome to Lantern Tabletop",
};

/**
 * Site 404 not found page component.
 */
function Page() {
  return (
    <div className="flex h-full">
      <div className="max-w-[50rem] flex flex-col mx-auto w-full h-full">
        <header className="mb-auto flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full text-sm py-4">
          <nav
            className="w-full px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
            aria-label="Global"
          >
            <div className="sm:min-w-80 flex items-center justify-between">
              <Link variant="plain" className="inline-flex text-xl" href="/" aria-label="Brand">
                <LanternLogo />{" "}
                <span data-testid="logo-text" className="pl-2">
                  Lantern Tabletop
                </span>
              </Link>
              <div className="sm:hidden">
                <button
                  type="button"
                  className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-2 rounded-md border border-gray-700 hover:border-gray-600 font-medium text-gray-300 hover:text-white shadow-sm align-middle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-600 transition-all text-sm"
                  data-hs-collapse="#navbar-collapse-with-animation"
                  aria-controls="navbar-collapse-with-animation"
                  aria-label="Toggle navigation"
                >
                  <svg
                    className="hs-collapse-open:hidden w-4 h-4"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                  <svg
                    className="hs-collapse-open:block hidden w-4 h-4"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
              </div>
            </div>
            <div
              id="navbar-collapse-with-animation"
              className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
            >
              <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
                <Link variant="plain" inactive={true} href="/">
                  Dashboard
                </Link>
                <Link variant="plain" inactive={true} href="/characters">
                  Characters
                </Link>
                <Link variant="plain" inactive={true} href={absoluteGraphqlUrl}>
                  API
                </Link>
                <Link variant="plain" inactive={true} href="/login">
                  Login
                </Link>
                <Link variant="plain" inactive={true} href="https://github.com/owl-factory/lantern">
                  GitHub
                </Link>
              </div>
            </div>
          </nav>
        </header>

        <main id="content" role="main">
          <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="block text-4xl font-bold text-white sm:text-4xl">404 - Not Found</h1>
          </div>
        </main>

        <footer className="mt-auto text-center py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-gray-400">
              Created by{" "}
              <a
                className="text-white decoration-2 underline underline-offset-2 font-medium hover:text-gray-200 hover:decoration-gray-400"
                href="https://lucyawrey.com"
                target="_blank"
              >
                Lucy Awrey
              </a>{" "}
              and{" "}
              <a
                className="text-white decoration-2 underline underline-offset-2 font-medium hover:text-gray-200 hover:decoration-gray-400"
                href="https://laurawenning.com"
                target="_blank"
              >
                Laura Wenning
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Page;
