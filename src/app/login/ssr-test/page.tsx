import { SsrQueryTest } from "app/login/ssr-test/SsrQueryTest";
import Loading from "components/Loading";
import { Metadata } from "next";
import { Suspense } from "react";

/**
 * Page metadata object, NextJs will append these values as meta tags to the <head>.
 */
export const metadata: Metadata = {
  title: "Todo SSR Query Test",
};

/**
 * /login:
 * Site login page component. This login page is experimental and will be replaced eventually.
 */
function Page() {
  return (
    <div className="flex h-full">
      <div className="max-w-[50rem] flex flex-col mx-auto">
        <Suspense fallback={<Loading />}>
          <SsrQueryTest />
        </Suspense>
      </div>
    </div>
  );
}

export default Page;
