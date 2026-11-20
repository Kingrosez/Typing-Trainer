import { preview } from "vite";
import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs";

async function main() {
  const screenshotsDir = path.resolve(process.cwd(), "design/implementation/screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log("Starting preview server for Stage 2.3 verification...");
  const previewServer = await preview({
    root: path.resolve(process.cwd(), "desktop"),
    preview: {
      port: 4175,
      host: "127.0.0.1",
    },
  });

  const url = previewServer.resolvedUrls.local[0];
  console.log(`Preview server running at ${url}`);

  console.log("Launching Chromium at 1440x900 resolution...");
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Full Stage 2.3 mock payload with authoritative W-04, W-05, W-06 telemetry
  const mockSummaryResponse = {
    userStatus: {
      displayName: "Alex",
      currentLevel: 12,
      currentTier: "Apprentice Touch Typist",
      totalXp: 2450,
      xpProgressInLevel: 450,
      xpRequiredForNextLevel: 1000,
      currentStreakDays: 5,
      longestStreakDays: 14,
      freezeShieldsAvailable: 2,
    },
    dailyGoal: {
      targetMinutes: 20,
      completedSecondsToday: 1320,
      remainingSecondsToday: 0,
      progressPercentage: 100.0,
      isCompletedToday: true,
    },
    primaryMetrics: {
      bestWpm: 72.0,
      averageWpm: 58.3,
      accuracy: 96.4,
      totalPracticeSeconds: 66900, // 18h 35m
      completedSessionCount: 142,
      currentSessionWpm: 64.0,
    },
    weeklyActivity: [
      { dayOfWeek: "Mon", date: "2026-11-16", durationSeconds: 1500, goalMet: true, isToday: false },
      { dayOfWeek: "Tue", date: "2026-11-17", durationSeconds: 1800, goalMet: true, isToday: false },
      { dayOfWeek: "Wed", date: "2026-11-18", durationSeconds: 900, goalMet: false, isToday: false },
      { dayOfWeek: "Thu", date: "2026-11-19", durationSeconds: 1600, goalMet: true, isToday: false },
      { dayOfWeek: "Fri", date: "2026-11-20", durationSeconds: 1320, goalMet: true, isToday: true },
      { dayOfWeek: "Sat", date: "2026-11-21", durationSeconds: 0, goalMet: false, isToday: false },
      { dayOfWeek: "Sun", date: "2026-11-22", durationSeconds: 0, goalMet: false, isToday: false },
    ],
    wpmTrend: [
      { sessionIndex: 1, sessionId: "sess-01", completedAt: "2026-11-14T09:00:00Z", netWpm: 52.0, grossWpm: 54.0, accuracy: 96.3, totalErrors: 2 },
      { sessionIndex: 2, sessionId: "sess-02", completedAt: "2026-11-14T14:30:00Z", netWpm: 54.5, grossWpm: 56.0, accuracy: 97.3, totalErrors: 1 },
      { sessionIndex: 3, sessionId: "sess-03", completedAt: "2026-11-15T10:15:00Z", netWpm: 51.0, grossWpm: 58.0, accuracy: 87.9, totalErrors: 7 }, // Error spike
      { sessionIndex: 4, sessionId: "sess-04", completedAt: "2026-11-15T16:45:00Z", netWpm: 56.2, grossWpm: 57.5, accuracy: 97.7, totalErrors: 1 },
      { sessionIndex: 5, sessionId: "sess-05", completedAt: "2026-11-16T11:00:00Z", netWpm: 55.0, grossWpm: 56.8, accuracy: 96.8, totalErrors: 2 },
      { sessionIndex: 6, sessionId: "sess-06", completedAt: "2026-11-16T17:20:00Z", netWpm: 58.1, grossWpm: 59.5, accuracy: 97.6, totalErrors: 1 },
      { sessionIndex: 7, sessionId: "sess-07", completedAt: "2026-11-17T09:30:00Z", netWpm: 57.4, grossWpm: 59.0, accuracy: 97.3, totalErrors: 2 },
      { sessionIndex: 8, sessionId: "sess-08", completedAt: "2026-11-17T15:10:00Z", netWpm: 60.5, grossWpm: 62.0, accuracy: 97.5, totalErrors: 2 },
      { sessionIndex: 9, sessionId: "sess-09", completedAt: "2026-11-18T10:00:00Z", netWpm: 59.0, grossWpm: 61.2, accuracy: 96.4, totalErrors: 3 },
      { sessionIndex: 10, sessionId: "sess-10", completedAt: "2026-11-18T16:30:00Z", netWpm: 53.0, grossWpm: 60.0, accuracy: 88.3, totalErrors: 6 }, // Error spike
      { sessionIndex: 11, sessionId: "sess-11", completedAt: "2026-11-19T10:45:00Z", netWpm: 61.4, grossWpm: 62.8, accuracy: 97.8, totalErrors: 1 },
      { sessionIndex: 12, sessionId: "sess-12", completedAt: "2026-11-19T14:00:00Z", netWpm: 63.2, grossWpm: 64.5, accuracy: 98.0, totalErrors: 1 },
      { sessionIndex: 13, sessionId: "sess-13", completedAt: "2026-11-20T08:15:00Z", netWpm: 62.0, grossWpm: 63.5, accuracy: 97.6, totalErrors: 2 },
      { sessionIndex: 14, sessionId: "sess-14", completedAt: "2026-11-20T11:30:00Z", netWpm: 66.8, grossWpm: 68.0, accuracy: 98.2, totalErrors: 1 },
      { sessionIndex: 15, sessionId: "sess-15", completedAt: "2026-11-20T13:00:00Z", netWpm: 68.5, grossWpm: 69.8, accuracy: 98.1, totalErrors: 1 },
    ],
    weakKeyRecommendations: [
      {
        keyChar: "r",
        errorRate: 0.142,
        accuracy: 85.8,
        opportunities: 85,
        errors: 12,
        wpi: 0.48,
        tier: "HIGH_PRIORITY",
        explanation: "Key 'r' has an error rate of 14.2% across 85 opportunities.",
      },
      {
        keyChar: "b",
        errorRate: 0.118,
        accuracy: 88.2,
        opportunities: 51,
        errors: 6,
        wpi: 0.42,
        tier: "HIGH_PRIORITY",
        explanation: "Key 'b' has an error rate of 11.8% across 51 opportunities.",
      },
      {
        keyChar: "p",
        errorRate: 0.095,
        accuracy: 90.5,
        opportunities: 63,
        errors: 6,
        wpi: 0.38,
        tier: "MEDIUM_PRIORITY",
        explanation: "Key 'p' has an error rate of 9.5% across 63 opportunities.",
      },
    ],
    personalBests: {
      best15sWpm: 84.0,
      best60sWpm: 72.0,
      bestDevModeWpm: 58.0,
      longestSessionSeconds: 2520.0,
    },
    recentSessions: [],
  };

  await page.route("**/api/v1/health", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "UP", application: "typing-trainer", apiVersion: "v1" }),
    });
  });

  await page.route("**/api/v1/dashboard/summary", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockSummaryResponse),
    });
  });

  await page.addInitScript(() => {
    window.__TAURI_INTERNALS__ = {
      invoke: async (cmd) => {
        if (cmd === "get_backend_connection" || cmd === "start_backend") {
          return {
            port: 4175,
            token: "screenshot-token",
            baseUrl: "",
          };
        }
        return {};
      },
    };
  });

  console.log("Navigating to Dashboard...");
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(600);

  // 1. Dark Mode Dashboard (1440x900)
  console.log("Capturing 10_dashboard_stage_2_3_dark.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "10_dashboard_stage_2_3_dark.png"),
  });

  // 2. Light Mode Dashboard (1440x900)
  console.log("Toggling theme to light...");
  const themeToggle = page.locator('button[aria-label="Toggle theme"]').first();
  await themeToggle.click();
  await page.waitForTimeout(400);

  console.log("Capturing 11_dashboard_stage_2_3_light.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "11_dashboard_stage_2_3_light.png"),
  });

  // Toggle back to dark
  await themeToggle.click();
  await page.waitForTimeout(200);

  await browser.close();
  await new Promise((resolve) => previewServer.httpServer.close(resolve));
  console.log("Stage 2.3 screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
