import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("renders with the provided value", () => {
    render(<SearchInput value="hello" onChange={vi.fn()} />);

    expect(screen.getByRole("textbox")).toHaveValue("hello");
  });

  it("has an accessible label", () => {
    render(<SearchInput value="" onChange={vi.fn()} />);

    expect(screen.getByLabelText("Search players")).toBeInTheDocument();
  });

  it("calls onChange when user types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SearchInput value="" onChange={handleChange} />);

    await user.type(screen.getByRole("textbox"), "a");
    expect(handleChange).toHaveBeenCalledWith("a");
  });

  it("shows clear button only when value is non-empty", () => {
    const { rerender } = render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();

    rerender(<SearchInput value="test" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("clears the value when clear button is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SearchInput value="test" onChange={handleChange} />);
    await user.click(screen.getByLabelText("Clear search"));

    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("clears on Escape key press", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SearchInput value="test" onChange={handleChange} />);

    screen.getByRole("textbox").focus();
    await user.keyboard("{Escape}");

    expect(handleChange).toHaveBeenCalledWith("");
  });
});
