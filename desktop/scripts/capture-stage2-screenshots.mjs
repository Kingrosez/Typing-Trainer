import { preview } from "vite";
import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs";

async function main() {
  const screenshotsDir = path.resolve(process.cwd(), "design/implementation/screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log("Starting preview server for Stage 2.2 verification...");
  const previewServer = await preview({
    root: path.resolve(process.cwd(), "desktop"),
    preview: {
      port: 4174,
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

  // Route API requests to return authoritative Stage 2.2 payload
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
      completedSecondsToday: 720,
      remainingSecondsToday: 480,
      progressPercentage: 60.0,
      isCompletedToday: false,
    },
    primaryMetrics: {
      bestWpm: 72.0,
      averageWpm: 58.3,
      accuracy: 96.4,
      totalPracticeSeconds: 66900, // 18h 35m
      completedSessionCount: 142,
      currentSessionWpm: 64.0,
    },
    weeklyActivity: [],
    wpmTrend: [],
    weakKeyRecommendations: [],
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
            port: 4174,
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
  console.log("Capturing 07_dashboard_stage_2_2_dark.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "07_dashboard_stage_2_2_dark.png"),
  });

  // 2. Open Daily Goal Modal
  console.log("Opening Daily Goal Edit Modal...");
  const editGoalBtn = page.locator('button[aria-label="Edit daily practice goal"]').first();
  await editGoalBtn.click();
  await page.waitForTimeout(400);

  console.log("Capturing 09_dashboard_stage_2_2_goal_modal.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "09_dashboard_stage_2_2_goal_modal.png"),
  });

  // Close modal via Escape
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 3. Light Mode Dashboard (1440x900)
  console.log("Toggling theme to light...");
  const themeToggle = page.locator('button[aria-label="Toggle theme"]').first();
  await themeToggle.click();
  await page.waitForTimeout(400);

  console.log("Capturing 08_dashboard_stage_2_2_light.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "08_dashboard_stage_2_2_light.png"),
  });

  // Toggle back to dark
  await themeToggle.click();
  await page.waitForTimeout(200);

  await browser.close();
  await new Promise((resolve) => previewServer.httpServer.close(resolve));
  console.log("Stage 2.2 screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
