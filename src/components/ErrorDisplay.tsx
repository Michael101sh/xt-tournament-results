// Shared presentational component for full-screen error states.
// Used by both ErrorCard (query errors) and ErrorBoundary (unhandled render errors).

interface ErrorDisplayProps {
  title: string;
  message: string;
  buttonText: string;
  buttonLabel: string;
  onAction: () => void;
}

export const ErrorDisplay = ({
  title,
  message,
  buttonText,
  buttonLabel,
  onAction,
}: ErrorDisplayProps) => (
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
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
      <button
        type="button"
        onClick={onAction}
        aria-label={buttonLabel}
        tabIndex={0}
        className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {buttonText}
      </button>
    </div>
  </div>
);
