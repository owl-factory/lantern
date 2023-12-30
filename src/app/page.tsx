import { TestComponent } from "components/TestComponent";

/**
 * Renders the landing page.
 */
function Page() {
  return (
    <main class="bg-slate-900 flex h-full">
    <div class="max-w-[50rem] flex flex-col mx-auto w-full h-full">
      <!-- ========== HEADER ========== -->
      <header class="mb-auto flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full text-sm py-4">
        <nav class="w-full px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8" aria-label="Global">
          <div class="flex items-center justify-between">
            <a class="flex-none text-xl font-semibold text-white" href="#" aria-label="Brand">LuCMS Admin</a>
            <div class="sm:hidden">
              <button type="button" class="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-2 rounded-md border border-gray-700 hover:border-gray-600 font-medium text-gray-300 hover:text-white shadow-sm align-middle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-600 transition-all text-sm" data-hs-collapse="#navbar-collapse-with-animation" aria-controls="navbar-collapse-with-animation" aria-label="Toggle navigation">
                <svg class="hs-collapse-open:hidden w-4 h-4" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
                <svg class="hs-collapse-open:block hidden w-4 h-4" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
            </div>
          </div>
          <div id="navbar-collapse-with-animation" class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block">
            <div class="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
              <a class="font-medium text-white" href="#" aria-current="page">Dashboard</a>
              <a class="font-medium text-gray-400 hover:text-gray-500" href="/docs">API Docs</a>
              <a class="font-medium text-gray-400 hover:text-gray-500" href="https://github.com/lucyawrey/lucms" target="_blank">GitHub</a>
            </div>
          </div>
        </nav>
      </header>
      <!-- ========== END HEADER ========== -->

      <!-- ========== MAIN CONTENT ========== -->
      <main id="content" role="main">
        <div class="text-center py-10 px-4 sm:px-6 lg:px-8">
          <h1 class="block text-2xl font-bold text-white sm:text-4xl">LuCMS Admin Dashboard</h1>
          <p class="mt-3 text-lg text-gray-300">This is a basic placeholder page with nothing but some styling and helpful links. Currently, it is served as a single static HTML file styled with the <a class="text-white decoration-2 underline underline-offset-2 font-medium hover:text-gray-200 hover:decoration-gray-400" href="https://tailwindcss.com" target="_blank">Tailwind CSS</a> CDN.</a></p>
          <div class="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
            <a class="w-full sm:w-auto inline-flex justify-center items-center gap-x-3.5 text-center border border-2 border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 hover:text-white hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition py-3 px-4" href="/docs">
              <svg class="w-2.5 h-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" stroke="currentColor"/>
              </svg>
              View OpenAPI docs
            </a>
            <a class="w-full sm:w-auto inline-flex justify-center items-center gap-x-3.5 text-center bg-white shadow-sm text-sm font-medium rounded-md hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition py-3 px-4" href="https://github.com/lucyawrey/lucms" target="_blank">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              View code on GitHub.
            </a>
          </div>
        </div>
      </main>
      <!-- ========== END MAIN CONTENT ========== -->

      <!-- ========== FOOTER ========== -->
      <footer class="mt-auto text-center py-5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p class="text-sm text-gray-400">Created by <a class="text-white decoration-2 underline underline-offset-2 font-medium hover:text-gray-200 hover:decoration-gray-400" href="https://lucyawrey.com" target="_blank">Lucy Awrey</a></p>
        </div>
      </footer>
      <!-- ========== END FOOTER ========== -->
    </div>
  </main>
  );
}

export default Page;
