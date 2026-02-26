import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorCard } from "./ErrorCard";

describe("ErrorCard", () => {
  it("renders the error message", () => {
    render(<ErrorCard message="Network error" />);

    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("renders 'Unable to load data' title", () => {
    render(<ErrorCard message="test" />);

    expect(screen.getByText("Unable to load data")).toBeInTheDocument();
  });

  it("renders a Retry button", () => {
    render(<ErrorCard message="test" />);

    expect(screen.getByLabelText("Retry loading data")).toBeInTheDocument();
  });
});
