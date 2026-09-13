// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PasswordInput from "./PasswordInput";

describe("PasswordInput", () => {
  it("masque le mot de passe puis permet de l’afficher", () => {
    const { container } = render(
      <PasswordInput
        id="password"
        name="password"
        value="secret"
        onChange={vi.fn()}
      />
    );

    const input = container.querySelector("input");
    const toggle = screen.getByRole("button", {
      name: "Afficher le mot de passe",
    });

    expect(input?.getAttribute("type")).toBe("password");

    fireEvent.click(toggle);

    expect(input?.getAttribute("type")).toBe("text");
    expect(screen.getByRole("button", {
      name: "Masquer le mot de passe",
    }).getAttribute("aria-pressed")).toBe("true");
  });
});
