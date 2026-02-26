import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorDisplay } from "./ErrorDisplay";

describe("ErrorDisplay", () => {
  it("renders title and message", () => {
    render(
      <ErrorDisplay
        title="Oops"
        message="Something broke"
        buttonText="Fix"
        buttonLabel="Fix the issue"
        onAction={vi.fn()}
      />,
    );

    expect(screen.getByText("Oops")).toBeInTheDocument();
    expect(screen.getByText("Something broke")).toBeInTheDocument();
  });

  it("renders an accessible action button", () => {
    render(
      <ErrorDisplay
        title="Error"
        message="msg"
        buttonText="Retry"
        buttonLabel="Retry loading"
        onAction={vi.fn()}
      />,
    );

    const btn = screen.getByLabelText("Retry loading");
    expect(btn).toHaveTextContent("Retry");
    expect(btn).toHaveAttribute("type", "button");
    expect(btn).toHaveAttribute("tabindex", "0");
  });

  it("calls onAction when the button is clicked", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <ErrorDisplay
        title="Error"
        message="msg"
        buttonText="Retry"
        buttonLabel="Retry loading"
        onAction={handleAction}
      />,
    );

    await user.click(screen.getByLabelText("Retry loading"));
    expect(handleAction).toHaveBeenCalledOnce();
  });
});
