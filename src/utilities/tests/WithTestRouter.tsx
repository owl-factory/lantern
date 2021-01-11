import React from "react";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/next-server/lib/router-context";


interface TestRouterProps {
  children: React.ReactElement;
  router: Partial<NextRouter>;
}

/**
 * WithTestRouter is a wrapper around any component or page that uses Next/Router's
 * useRouter() hook. Since we're not running this in a browser, we need to fake it
 * with this little number. Pass in the expected router object with push, pathname,
 * and asPath specified.
 *
 * References the withTestRouter function seen here: https://w11i.me/next-js-userouter-testing
 * Though it has been modified to actually work
 *
 * @param props.children The component/page with useRouter() inside of it
 * @param props.router A partial router object to create a dummy router object
 */
export function WithTestRouter(props: TestRouterProps) {
  const {
    route = "",
    pathname = "",
    query = {},
    asPath = "",
    push = async () => true,
    replace = async () => true,
    reload = () => null,
    back = () => null,
    prefetch = async () => undefined,
    beforePopState = () => null,
    isFallback = false,
    events = {
      on: () => null,
      off: () => null,
      emit: () => null,
    },
  } = props.router || {};

  return (
    <RouterContext.Provider
      value={{
        route,
        pathname,
        query,
        asPath,
        push,
        replace,
        reload,
        back,
        prefetch,
        beforePopState,
        isFallback,
        events,
      }}
    >
      {props.children}
    </RouterContext.Provider>
  );
}
