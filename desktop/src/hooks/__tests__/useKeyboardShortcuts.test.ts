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

  it("handles Ctrl+1 through Ctrl+8 and Ctrl+, application navigation", () => {
    renderHook(() => useKeyboardShortcuts());

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "1", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/");

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

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "7", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/analytics");

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "8", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/achievements");

    window.dispatchEvent(new KeyboardEvent("keydown", { key: ",", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/settings");
  });

  it("handles universal shortcuts: Ctrl+K, F11, Ctrl+Shift+T, and Ctrl+B", () => {
    renderHook(() => useKeyboardShortcuts());

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
    expect(mockToggleCommandPalette).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "F11" }));
    expect(mockToggleZenMode).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "t", ctrlKey: true, shiftKey: true }));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("suppresses navigation when an input, textarea, or contentEditable element is focused", () => {
    renderHook(() => useKeyboardShortcuts());

    // 1. Input element
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    const event1 = new KeyboardEvent("keydown", { key: "2", ctrlKey: true });
    Object.defineProperty(event1, "target", { value: input });
    window.dispatchEvent(event1);
    expect(mockNavigate).not.toHaveBeenCalled();

    // 2. Textarea element
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();
    const event2 = new KeyboardEvent("keydown", { key: "2", ctrlKey: true });
    Object.defineProperty(event2, "target", { value: textarea });
    window.dispatchEvent(event2);
    expect(mockNavigate).not.toHaveBeenCalled();

    // 3. contentEditable element
    const contentEditable = document.createElement("div");
    contentEditable.contentEditable = "true";
    document.body.appendChild(contentEditable);
    contentEditable.focus();
    const event3 = new KeyboardEvent("keydown", { key: "2", ctrlKey: true });
    Object.defineProperty(event3, "target", { value: contentEditable });
    window.dispatchEvent(event3);
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

  it("removes event listener on unmount", () => {
    const { unmount } = renderHook(() => useKeyboardShortcuts());
    unmount();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "2", ctrlKey: true }));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
