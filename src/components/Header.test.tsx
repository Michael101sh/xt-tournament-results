import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("renders the tournament title", () => {
    render(<Header />);

    expect(screen.getByText("XT tournament")).toBeInTheDocument();
    expect(screen.getByText("Final results")).toBeInTheDocument();
  });

  it("uses an h1 heading element", () => {
    render(<Header />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
