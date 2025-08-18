import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("renders button with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled button</Button>);

    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeDisabled();
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={handleClick}>
        Disabled button
      </Button>,
    );

    const button = screen.getByRole("button", { name: /disabled button/i });
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  describe("variants", () => {
    it("renders default variant", () => {
      render(<Button variant="default">Default</Button>);

      const button = screen.getByRole("button", { name: /default/i });
      expect(button).toHaveClass("bg-primary", "text-primary-foreground");
    });

    it("renders destructive variant", () => {
      render(<Button variant="destructive">Destructive</Button>);

      const button = screen.getByRole("button", { name: /destructive/i });
      expect(button).toHaveClass("bg-destructive", "text-white");
    });

    it("renders outline variant", () => {
      render(<Button variant="outline">Outline</Button>);

      const button = screen.getByRole("button", { name: /outline/i });
      expect(button).toHaveClass("border", "bg-background");
    });

    it("renders secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole("button", { name: /secondary/i });
      expect(button).toHaveClass("bg-secondary", "text-secondary-foreground");
    });

    it("renders ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByRole("button", { name: /ghost/i });
      expect(button).toHaveClass("hover:bg-accent");
    });

    it("renders link variant", () => {
      render(<Button variant="link">Link</Button>);

      const button = screen.getByRole("button", { name: /link/i });
      expect(button).toHaveClass("text-primary", "underline-offset-4");
    });
  });

  describe("sizes", () => {
    it("renders default size", () => {
      render(<Button size="default">Default size</Button>);

      const button = screen.getByRole("button", { name: /default size/i });
      expect(button).toHaveClass("h-9", "px-4", "py-2");
    });

    it("renders small size", () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole("button", { name: /small/i });
      expect(button).toHaveClass("h-8", "px-3");
    });

    it("renders large size", () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole("button", { name: /large/i });
      expect(button).toHaveClass("h-10", "px-6");
    });

    it("renders icon size", () => {
      render(
        <Button size="icon" aria-label="Icon button">
          🚀
        </Button>,
      );

      const button = screen.getByRole("button", { name: /icon button/i });
      expect(button).toHaveClass("size-9");
    });
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole("button", { name: /custom/i });
    expect(button).toHaveClass("custom-class");
  });

  it("renders as child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link button</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveAttribute("data-slot", "button");
  });

  it("passes through additional props", () => {
    render(
      <Button type="submit" name="submit-btn">
        Submit
      </Button>,
    );

    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("name", "submit-btn");
  });

  it("supports keyboard interaction", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Keyboard test</Button>);

    const button = screen.getByRole("button", { name: /keyboard test/i });
    button.focus();

    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
