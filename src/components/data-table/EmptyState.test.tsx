import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders 'No results found' message", () => {
    render(<EmptyState />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders a helpful hint to adjust search/filters", () => {
    render(<EmptyState />);
    expect(screen.getByText("Try adjusting your search or filters.")).toBeInTheDocument();
  });
});
