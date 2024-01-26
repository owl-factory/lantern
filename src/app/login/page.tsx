import { LanternLogo } from "components/LanternLogo";
import { Metadata } from "next";
import { Link } from "components/ui/Link";
import { absoluteGraphqlUrl } from "utils/environment";
import { Button } from "components/ui/Button";
import gql from "graphql-tag";
import { getServerClient } from "lib/graphql/serverClient";
import { PasswordField } from "app/login/PasswordField";
import { getSessionId } from "lib/authentication";
import Image from "next/image";

/**
 * Page metadata object, NextJs will append these values as meta tags to the <head>.
 */
export const metadata: Metadata = {
  title: "Login",
  description: "Welcome to Lantern Tabletop's Login Page",
};

const loginMutation = gql`
  mutation Mutation($username: String!, $password: String!) {
    login(username: $username, password: $password, setCookie: true)
  }
`;

const logoutMutation = gql`
  mutation Mutation {
    logout(deleteCookie: true)
  }
`;

const sessionQuery = gql`
  query Session {
    session {
      user {
        username
        displayName
        iconUrl
      }
    }
  }
`;

/**
 * /login:
 * Site login page component. This login page is experimental and will be replaced eventually.
 */
async function Page() {
  let user: { username: string; displayName: string; iconUrl: string } | undefined;
  if (getSessionId().ok) {
    const client = getServerClient();
    const res = await client.query(sessionQuery, {});
    user = res?.data?.session?.user;
    if (user?.iconUrl) {
      user.iconUrl = user.iconUrl.replace("https://lanterntt.com", "");
    }
  }

  async function submitLogin(formData: FormData) {
    "use server";
    const client = getServerClient();
    await client.mutation(loginMutation, {
      username: formData.get("username"),
      password: formData.get("password"),
    });
  }

  async function submitLogout() {
    "use server";
    const client = getServerClient();
    await client.mutation(logoutMutation, {});
  }

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
                <Button
                  color="none"
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
                <Link variant="plain" inactive={true} href="/">
                  Dashboard
                </Link>
                <Link variant="plain" inactive={true} href="/characters">
                  Characters
                </Link>
                <Link variant="plain" inactive={true} href={absoluteGraphqlUrl}>
                  API
                </Link>
                <Link variant="plain" href="/login" aria-current="page">
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
          {!user ? (
            <section id="login-card">
              <div className="flex flex-col items-center justify-center px-6 mx-auto">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Sign in to your account
                    </h1>
                    <form className="space-y-4 md:space-y-6" action={submitLogin}>
                      <div>
                        <label
                          htmlFor="username"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Your email or username
                        </label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="name@website.com"
                          required
                          spellCheck={false}
                        />
                      </div>
                      <PasswordField />
                      <Button
                        type="submit"
                        className="w-full hover:text-blue-600 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        Sign in
                      </Button>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Don’t have an account yet?{" "}
                        <Link
                          href="#"
                          variant="none"
                          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >
                          Sign up
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section
              id="welcome!"
              className="mt-3 text-lg text-gray-300 flex flex-col items-center"
            >
              <h2 className="text-2xl text-white text-center pb-12">
                Welcome, {user.displayName || user.username}!<span className="p-2"> </span>
                <Image
                  className="inline-block h-[3.875rem] w-[3.875rem] rounded-full"
                  src={user.iconUrl}
                  width={402}
                  height={402}
                  alt={`${user.username}'s profile picture.`}
                />
              </h2>
              <form action={submitLogout}>
                <Button type="submit">Logout</Button>
              </form>
            </section>
          )}
          <br />
          <div className="text-center mt-4">
            <Link href="/login/ssr-test">
              Todo list Server Side rendered test page, with Suspense.
            </Link>
          </div>
        </main>

        <footer className="mt-auto text-center py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-gray-400">
              Created by <Link href="https://lucyawrey.com">Lucy Awrey</Link> and{" "}
              <Link href="https://laurawenning.com">Laura Wenning</Link>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Page;
