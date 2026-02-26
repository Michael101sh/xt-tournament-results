import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders nothing when totalPages is 1 or less", () => {
    const { container } = render(
      <Pagination currentPage={0} totalPages={1} onPageChange={vi.fn()} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders first, prev, next, last buttons", () => {
    render(<Pagination currentPage={0} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByLabelText("Go to first page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to last page")).toBeInTheDocument();
  });

  it("disables first/prev buttons on the first page", () => {
    render(<Pagination currentPage={0} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByLabelText("Go to first page")).toBeDisabled();
    expect(screen.getByLabelText("Go to previous page")).toBeDisabled();
    expect(screen.getByLabelText("Go to next page")).toBeEnabled();
    expect(screen.getByLabelText("Go to last page")).toBeEnabled();
  });

  it("disables next/last buttons on the last page", () => {
    render(<Pagination currentPage={4} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByLabelText("Go to first page")).toBeEnabled();
    expect(screen.getByLabelText("Go to previous page")).toBeEnabled();
    expect(screen.getByLabelText("Go to next page")).toBeDisabled();
    expect(screen.getByLabelText("Go to last page")).toBeDisabled();
  });

  it("marks the current page with aria-current='page'", () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />);

    const activePage = screen.getByLabelText("Go to page 3");
    expect(activePage).toHaveAttribute("aria-current", "page");
  });

  it("calls onPageChange with correct page index on click", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Pagination currentPage={2} totalPages={5} onPageChange={handleChange} />);

    await user.click(screen.getByLabelText("Go to next page"));
    expect(handleChange).toHaveBeenCalledWith(3);

    await user.click(screen.getByLabelText("Go to previous page"));
    expect(handleChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByLabelText("Go to first page"));
    expect(handleChange).toHaveBeenCalledWith(0);

    await user.click(screen.getByLabelText("Go to last page"));
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("renders all page numbers when totalPages <= 5", () => {
    render(<Pagination currentPage={0} totalPages={4} onPageChange={vi.fn()} />);

    expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to page 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to page 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to page 4")).toBeInTheDocument();
  });

  it("renders ellipsis for large page counts", () => {
    render(<Pagination currentPage={10} totalPages={20} onPageChange={vi.fn()} />);

    const ellipses = screen.getAllByText("…");
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });
});
