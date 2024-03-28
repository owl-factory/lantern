import { SsrQueryTest } from "app/login/ssr-test/SsrQueryTest";
import Loading from "components/Loading";
import { Metadata } from "next";
import { Suspense } from "react";

/**
 * Page metadata object, NextJs will append these values as meta tags to the <head>.
 */
export const metadata: Metadata = {
  title: "Todo List SSR Query Test",
};

/**
 * /login:
 * Site login page component. This login page is experimental and will be replaced eventually.
 */
function Page() {
  return (
    <div className="flex h-full">
      <div className="max-w-[50rem] flex flex-col mx-auto">
        <section
          id="gql-todo-test"
          className="mt-3 text-lg text-gray-300 px-14 pt-2 flex flex-col items-center"
        >
          <h2 className="text-2xl text-white text-center py-5">
            Todo List - Server Side Rendered with Suspense
          </h2>
          <Suspense fallback={<Loading />}>
            <SsrQueryTest />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

export default Page;
