import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorDisplay } from "./ErrorDisplay";

// Class component required — React has no hook-based error boundary API yet.
// Wraps the entire app tree to catch unhandled render errors gracefully.
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <ErrorDisplay
        title="Something went wrong"
        message={this.state.error?.message ?? "An unexpected error occurred."}
        buttonText="Reload page"
        buttonLabel="Reload the page"
        onAction={() => window.location.reload()}
      />
    );
  }
}
