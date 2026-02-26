import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LevelFilter } from "./LevelFilter";

describe("LevelFilter", () => {
  it("renders a select with all level options plus 'All'", () => {
    render(<LevelFilter value={undefined} onChange={vi.fn()} />);

    const select = screen.getByLabelText("Filter by level");
    const options = select.querySelectorAll("option");

    expect(options).toHaveLength(4); // All, Rookie, Amateur, Pro
    expect(options[0]).toHaveTextContent("All");
    expect(options[1]).toHaveTextContent("Rookie");
    expect(options[2]).toHaveTextContent("Amateur");
    expect(options[3]).toHaveTextContent("Pro");
  });

  it("shows the current level as selected", () => {
    render(<LevelFilter value="pro" onChange={vi.fn()} />);

    expect(screen.getByLabelText("Filter by level")).toHaveValue("pro");
  });

  it("shows 'All' when value is undefined", () => {
    render(<LevelFilter value={undefined} onChange={vi.fn()} />);

    expect(screen.getByLabelText("Filter by level")).toHaveValue("");
  });

  it("calls onChange with the selected level", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<LevelFilter value={undefined} onChange={handleChange} />);

    await user.selectOptions(screen.getByLabelText("Filter by level"), "amateur");
    expect(handleChange).toHaveBeenCalledWith("amateur");
  });

  it("calls onChange with undefined when 'All' is selected", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<LevelFilter value="pro" onChange={handleChange} />);

    await user.selectOptions(screen.getByLabelText("Filter by level"), "");
    expect(handleChange).toHaveBeenCalledWith(undefined);
  });
});
