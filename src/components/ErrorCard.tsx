interface ErrorCardProps {
  message: string;
}

// Full-screen error state shown when the API is unreachable or returns an error
export const ErrorCard = ({ message }: ErrorCardProps) => (
  <div className="bg-mesh flex h-screen items-center justify-center">
    <div className="mx-4 max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-lg">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-6 w-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-900">
        Unable to load data
      </h2>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        aria-label="Retry loading data"
        tabIndex={0}
        className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Retry
      </button>
    </div>
  </div>
);
