import { ErrorDisplay } from "./ErrorDisplay";

interface ErrorCardProps {
  message: string;
}

// Full-screen error state shown when the API is unreachable or returns an error
export const ErrorCard = ({ message }: ErrorCardProps) => (
  <ErrorDisplay
    title="Unable to load data"
    message={message}
    buttonText="Retry"
    buttonLabel="Retry loading data"
    onAction={() => window.location.reload()}
  />
);
