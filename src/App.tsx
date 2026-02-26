import { useSuspectsQuery } from "./hooks/useSuspectsQuery";

const App = () => {
  const { data: suspects, isLoading, isError, error } = useSuspectsQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-500">Loading suspects...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800">Failed to fetch suspects</h2>
          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <p className="mt-1 text-xs text-red-400">
            Make sure the server is running on http://localhost:20000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4">
      <h1 className="text-3xl font-bold text-slate-800">
        XT tournament - Final results
      </h1>

      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700">
          useSuspectsQuery test
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Fetched {suspects?.length ?? 0} suspect IDs from the server:
        </p>
        <pre className="mt-3 max-h-48 overflow-auto rounded bg-slate-100 p-3 text-xs text-slate-700">
          {JSON.stringify(suspects, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default App;
