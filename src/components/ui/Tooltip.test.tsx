import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("renders children", () => {
    render(
      <Tooltip content="Help text">
        <span>Trigger</span>
      </Tooltip>,
    );

    expect(screen.getByText("Trigger")).toBeInTheDocument();
  });

  it("does not show tooltip content by default", () => {
    render(
      <Tooltip content="Help text">
        <span>Trigger</span>
      </Tooltip>,
    );

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows tooltip on mouse enter and hides on mouse leave", () => {
    render(
      <Tooltip content="Help text">
        <span>Trigger</span>
      </Tooltip>,
    );

    const trigger = screen.getByText("Trigger").closest("span")!;
    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Help text");

    fireEvent.mouseLeave(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows tooltip on focus and hides on blur", () => {
    render(
      <Tooltip content="Help text">
        <span>Trigger</span>
      </Tooltip>,
    );

    const trigger = screen.getByText("Trigger").closest("span")!;
    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.blur(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("applies custom className to the wrapper", () => {
    const { container } = render(
      <Tooltip content="Help text" className="block">
        <span>Trigger</span>
      </Tooltip>,
    );

    // The outermost span is the tooltip wrapper that receives the className
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass("block");
  });
});
