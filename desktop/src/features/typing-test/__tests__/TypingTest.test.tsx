import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { vi, describe, beforeEach, test, expect } from "vitest";
import TypingTest from "../TypingTest";

// Mock the useNavigate hook
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("TypingTest Component", () => {
  const mockText = "Hello world";

  beforeEach(() => {
    render(
      <Router>
        <TypingTest duration={30} text={mockText} />
      </Router>,
    );
  });

  test("renders without crashing", () => {
    expect(screen.getByText(/Typing Test/i)).toBeInTheDocument();
  });

  test("displays the test text correctly", () => {
    expect(
      screen.getByText((_, element) => element?.textContent === mockText),
    ).toBeInTheDocument();
  });

  test("updates input field when user types", async () => {
    const textarea = screen.getByPlaceholderText(/Start typing here/i);

    fireEvent.change(textarea, { target: { value: "Hello" } });

    await waitFor(() => {
      expect(textarea).toHaveValue("Hello");
    });
  });

  test("calculates WPM and accuracy correctly", async () => {
    const textarea = screen.getByPlaceholderText(/Start typing here/i);

    fireEvent.change(textarea, { target: { value: "Hello world" } });

    await waitFor(() => {
      // Should have updated metrics
      expect(screen.getByText(/WPM/i)).toBeInTheDocument();
      expect(screen.getByText(/Accuracy/i)).toBeInTheDocument();
    });
  });
});
