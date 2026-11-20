import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RecentSessionsTable } from "../components/RecentSessionsTable";
import type { RecentSessionSummaryDto } from "@/services/api/dashboardTypes";
import { sessionService } from "@/services/api/sessionService";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/services/api/sessionService", () => ({
  sessionService: {
    getRecentSessions: vi.fn(),
  },
}));

describe("RecentSessionsTable (W-10)", () => {
  const mockInitialSessions: RecentSessionSummaryDto[] = [
    {
      id: "sess-1",
      sessionMode: "TYPING_TEST",
      netWpm: 72.4,
      grossWpm: 75.0,
      accuracy: 98.4,
      totalErrors: 2,
      durationSeconds: 60.0,
      xpEarned: 50,
      completedAt: "2026-11-20T10:00:00Z",
      isOfficialBenchmark: true,
    },
    {
      id: "sess-2",
      sessionMode: "DEVELOPER_MODE",
      netWpm: 58.1,
      grossWpm: 60.0,
      accuracy: 97.2,
      totalErrors: 3,
      durationSeconds: 120.0,
      xpEarned: 40,
      completedAt: "2026-11-19T14:30:00Z",
      isOfficialBenchmark: false,
    },
    {
      id: "sess-3",
      sessionMode: "LEARNING_MODE",
      netWpm: 45.0,
      grossWpm: 48.0,
      accuracy: 92.5,
      totalErrors: 5,
      durationSeconds: 180.0,
      xpEarned: 30,
      completedAt: "2026-11-18T16:00:00Z",
      isOfficialBenchmark: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders initial sessions without making a redundant API call on initial load", () => {
    render(<RecentSessionsTable initialSessions={mockInitialSessions} />);

    // Table header and session count
    expect(screen.getByText("Recent Practice Sessions")).toBeInTheDocument();
    expect(screen.getByText("3 Sessions")).toBeInTheDocument();

    // Verifies data rows rendered
    expect(screen.getByText("Typing Test")).toBeInTheDocument();
    expect(screen.getByText("Dev Mode")).toBeInTheDocument();
    expect(screen.getByText("Learning")).toBeInTheDocument();

    // Net WPM and XP
    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText("+50 XP")).toBeInTheDocument();
    expect(screen.getByText("+40 XP")).toBeInTheDocument();
    expect(screen.getByText("+30 XP")).toBeInTheDocument();

    // Benchmark status badge for 60s benchmark
    expect(screen.getByText("Official")).toBeInTheDocument();

    // CRITICAL: No extra API call made on mount
    expect(sessionService.getRecentSessions).not.toHaveBeenCalled();
  });

  it("renders clean empty state with start practice CTA when initialSessions is empty", () => {
    render(<RecentSessionsTable initialSessions={[]} />);

    expect(screen.getByText("No practice sessions recorded yet")).toBeInTheDocument();
    expect(
      screen.getByText(/Start a typing test, learning drill, or code sprint to log your historical telemetry/i)
    ).toBeInTheDocument();

    const startButton = screen.getByRole("button", { name: /Start Practice Test/i });
    fireEvent.click(startButton);
    expect(mockNavigate).toHaveBeenCalledWith("/typing-test");
  });

  it("handles pagination navigation with backend sessionService", async () => {
    // 6 initial sessions across 2 pages
    const sixSessions: RecentSessionSummaryDto[] = Array.from({ length: 6 }, (_, i) => ({
      id: `s-${i + 1}`,
      sessionMode: "TYPING_TEST",
      netWpm: 60 + i,
      grossWpm: 65 + i,
      accuracy: 96.0,
      totalErrors: 1,
      durationSeconds: 60.0,
      xpEarned: 35,
      completedAt: `2026-11-20T1${i}:00:00Z`,
    }));

    vi.mocked(sessionService.getRecentSessions).mockResolvedValue({
      items: [
        {
          id: "s-page-2",
          sessionMode: "TYPING_GAMES",
          netWpm: 80.0,
          grossWpm: 82.0,
          accuracy: 99.0,
          totalErrors: 1,
          rawCharacters: 400,
          correctCharacters: 395,
          durationSeconds: 90.0,
          passage: "Arcade",
          completedAt: "2026-11-17T12:00:00Z",
          xpEarned: 60,
          isOfficialBenchmark: false,
        },
      ],
      page: 1,
      size: 5,
      totalItems: 6,
      totalPages: 2,
    });

    render(<RecentSessionsTable initialSessions={sixSessions} />);

    // Click Next button
    const nextButton = screen.getByRole("button", { name: /Next Page/i });
    expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(sessionService.getRecentSessions).toHaveBeenCalledWith(1, 5, "completedAt,desc");
    });

    // Page 2 items displayed
    expect(await screen.findByText("Arcade")).toBeInTheDocument();
    expect(screen.getByText("+60 XP")).toBeInTheDocument();
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  });

  it("handles pagination API failure and provides retry button", async () => {
    const sixSessions: RecentSessionSummaryDto[] = Array.from({ length: 6 }, (_, i) => ({
      id: `s-${i + 1}`,
      sessionMode: "TYPING_TEST",
      netWpm: 60 + i,
      grossWpm: 65 + i,
      accuracy: 96.0,
      totalErrors: 1,
      durationSeconds: 60.0,
      xpEarned: 35,
      completedAt: `2026-11-20T1${i}:00:00Z`,
    }));

    vi.mocked(sessionService.getRecentSessions).mockRejectedValue(new Error("Connection refused"));

    render(<RecentSessionsTable initialSessions={sixSessions} />);

    const nextButton = screen.getByRole("button", { name: /Next Page/i });
    fireEvent.click(nextButton);

    expect(await screen.findByText(/Connection refused/i)).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /Retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it("renders semantic accessible table elements", () => {
    render(<RecentSessionsTable initialSessions={mockInitialSessions} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(7);
    expect(headers[0]).toHaveTextContent("Date & Time");
    expect(headers[1]).toHaveTextContent("Practice Mode");
    expect(headers[2]).toHaveTextContent("Duration");
    expect(headers[3]).toHaveTextContent("Net Speed");
    expect(headers[4]).toHaveTextContent("Accuracy");
    expect(headers[5]).toHaveTextContent("XP Earned");
    expect(headers[6]).toHaveTextContent("Status");
  });

  it("renders loading state when isLoading is true", () => {
    render(<RecentSessionsTable initialSessions={[]} isLoading={true} />);

    expect(screen.getByLabelText("Loading Recent Practice Sessions")).toBeInTheDocument();
  });

  it("respects authoritative backend isOfficialBenchmark flag and does not classify custom or non-qualifying sessions as official", () => {
    const customCorpusSession: RecentSessionSummaryDto = {
      id: "sess-custom",
      sessionMode: "CUSTOM_TEXT",
      netWpm: 90.0,
      grossWpm: 92.0,
      accuracy: 99.0,
      totalErrors: 1,
      durationSeconds: 60.0,
      xpEarned: 60,
      completedAt: "2026-11-20T11:00:00Z",
      isOfficialBenchmark: false, // Authoritative: custom corpus cannot be official benchmark
    };

    render(<RecentSessionsTable initialSessions={[customCorpusSession]} />);

    expect(screen.getByText("Practice")).toBeInTheDocument();
    expect(screen.queryByText("Official")).not.toBeInTheDocument();
  });

  it("safely handles invalid date format by displaying fallback dash", () => {
    const invalidDateSession: RecentSessionSummaryDto = {
      id: "sess-invalid-date",
      sessionMode: "TYPING_TEST",
      netWpm: 60.0,
      grossWpm: 62.0,
      accuracy: 95.0,
      totalErrors: 2,
      durationSeconds: 60.0,
      xpEarned: 40,
      completedAt: "not-a-valid-date",
      isOfficialBenchmark: false,
    };

    render(<RecentSessionsTable initialSessions={[invalidDateSession]} />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
