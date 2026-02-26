import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingOverlay } from "./LoadingOverlay";

describe("LoadingOverlay", () => {
  it("renders the loading text", () => {
    render(<LoadingOverlay />);

    expect(screen.getByText("Loading players…")).toBeInTheDocument();
  });

  it("renders a spinner with aria-hidden", () => {
    const { container } = render(<LoadingOverlay />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("animate-spin");
  });
});
