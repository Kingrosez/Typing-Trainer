import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboardShortcuts } from "../useKeyboardShortcuts";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockToggleCommandPalette = vi.fn();
const mockToggleZenMode = vi.fn();
vi.mock("../../store/useShellStore", () => ({
  useShellStore: () => ({
    toggleSidebar: vi.fn(),
    toggleCommandPalette: mockToggleCommandPalette,
    toggleZenMode: mockToggleZenMode,
  }),
}));

const mockToggleTheme = vi.fn();
vi.mock("../../app/providers/ThemeProvider", () => ({
  useTheme: () => ({
    theme: "dark",
    toggleTheme: mockToggleTheme,
  }),
}));

describe("useKeyboardShortcuts", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    document.body.innerHTML = "";
  });

  it("handles Ctrl+2 through Ctrl+6 application navigation", () => {
    renderHook(() => useKeyboardShortcuts());

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "2", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/typing-test");

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "3", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/learning-mode");

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "4", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/skill-drills");

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "5", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/developer-mode");

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "6", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/typing-games");
  });

  it("suppresses navigation when an input element is focused", () => {
    renderHook(() => useKeyboardShortcuts());

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent("keydown", { key: "2", ctrlKey: true });
    Object.defineProperty(event, "target", { value: input });
    window.dispatchEvent(event);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("suppresses navigation when a modal dialog is open", () => {
    renderHook(() => useKeyboardShortcuts());

    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    document.body.appendChild(dialog);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "2", ctrlKey: true }));

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
