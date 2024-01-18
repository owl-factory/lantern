import { LanternLogo } from "components/LanternLogo";
import { Metadata } from "next";
import { Link } from "components/ui/Link";
import { absoluteGraphqlEndpoint } from "utils/environment";
import { Button } from "components/ui/Button";

/**
 * Page metadata object, NextJs will append these values as meta tags to the <head>.
 */
export const metadata: Metadata = {
  title: "Welcome - Lantern Tabletop",
  description: "Welcome to Lantern Tabletop",
};

/**
 * "/"
 * Site index/landing page component.
 */
function Page() {
  return (
    <div className="bg-zinc-900 flex h-full">
      <div className="max-w-[50rem] flex flex-col mx-auto w-full h-full">
        <header className="mb-auto flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full text-sm py-4">
          <nav className="w-full px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8" aria-label="Global">
            <div className="sm:min-w-80 flex items-center justify-between">
              <Link className="inline-flex text-xl font-semibold text-white" href="/" aria-label="Brand">
                <LanternLogo />{" "}
                <span data-testid="logo-text" className="pl-2">
                  Lantern Tabletop
                </span>
              </Link>
              <div className="sm:hidden">
                <Button
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
                </Button>
              </div>
            </div>
            <div
              id="navbar-collapse-with-animation"
              className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
            >
              <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
                <Link className="font-medium text-white" href="/" aria-current="page">
                  Dashboard
                </Link>
                <Link className="font-medium text-gray-400 hover:text-gray-500" href="/characters">
                  Characters
                </Link>
                <Link className="font-medium text-gray-400 hover:text-gray-500" href={absoluteGraphqlEndpoint}>
                  API
                </Link>
                <Link
                  className="font-medium text-gray-400 hover:text-gray-500"
                  href="https://github.com/owl-factory/lantern"
                >
                  GitHub
                </Link>
              </div>
            </div>
          </nav>
        </header>

        <main id="content" role="main">
          <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="block text-2xl font-bold text-white sm:text-4xl">Welcome to Lantern Tabletop</h1>
            <p className="mt-3 text-lg text-gray-300">
              Lantern is a web-based project aiming to create a flexible, open-source alternative to online virtual
              tabletops such as Roll20 and D&D Beyond. Currently, it is built using Typescript, React, NextJS, and
              GraphQL. It is styled with TailwindCSS and backed by a PostgreSQL database via Kysely.
            </p>
            <div className="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
              <Link
                className="w-full sm:w-auto inline-flex justify-center items-center gap-x-3.5 text-center border-2 border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 hover:text-white hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition py-3 px-4"
                href={absoluteGraphqlEndpoint}
              >
                <svg className="w-2.5 h-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"
                    stroke="currentColor"
                  />
                </svg>
                View GraphQL API
              </Link>
              <Link
                className="w-full sm:w-auto inline-flex justify-center items-center gap-x-3.5 text-center bg-amber-400 shadow-sm text-sm font-medium rounded-md hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition py-3 px-4"
                href="https://github.com/owl-factory/lantern"
                target="_blank"
              >
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                View code on GitHub.
              </Link>
            </div>
          </div>
        </main>

        <footer className="mt-auto text-center py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-gray-400">
              Created by{" "}
              <Link
                className="text-white decoration-2 underline underline-offset-2 font-medium hover:text-gray-200 hover:decoration-gray-400"
                href="https://lucyawrey.com"
                target="_blank"
              >
                Lucy Awrey
              </Link>{" "}
              and{" "}
              <Link
                className="text-white decoration-2 underline underline-offset-2 font-medium hover:text-gray-200 hover:decoration-gray-400"
                href="https://laurawenning.com"
                target="_blank"
              >
                Laura Wenning
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Page;
