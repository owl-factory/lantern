/**
 * Loading spinner component for use in {@link https://react.dev/reference/react/Suspense |React Suspense}.
 */
export default function Loading() {
  return (
    <div className="flex flex-auto flex-col justify-center items-center p-4 h-full">
      <div className="flex justify-center">
        <div
          className="animate-spin inline-block w-12 h-12 border-[3px] border-current border-t-transparent text-amber-500 rounded-full"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}
