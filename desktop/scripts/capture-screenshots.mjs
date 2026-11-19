import { preview } from "vite";
import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs";

async function main() {
  const screenshotsDir = path.resolve("../design/implementation/screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log("Starting preview server...");
  const previewServer = await preview({
    root: path.resolve("."),
    preview: {
      port: 4173,
      host: "127.0.0.1",
    },
  });

  const url = previewServer.resolvedUrls.local[0];
  console.log(`Preview server running at ${url}`);

  console.log("Launching Chromium...");
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("Navigating to application shell...");
  await page.goto(url);
  await page.waitForLoadState("networkidle");

  // 1. Dark Mode Dashboard (Midnight Slate)
  console.log("Capturing 01_shell_dark_dashboard.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "01_shell_dark_dashboard.png"),
  });

  // 2. Light Mode Dashboard (Daylight Studio)
  console.log("Toggling theme to light...");
  const themeToggle = page.locator('button[aria-label="Toggle theme"]').first();
  await themeToggle.click();
  await page.waitForTimeout(400);
  console.log("Capturing 02_shell_light_dashboard.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "02_shell_light_dashboard.png"),
  });

  // Toggle back to dark
  await themeToggle.click();
  await page.waitForTimeout(300);

  // 3. Collapsed Sidebar Rail
  console.log("Collapsing sidebar...");
  const collapseButton = page.locator('button[aria-label*="Collapse sidebar"]').first();
  await collapseButton.click();
  await page.waitForTimeout(400);
  console.log("Capturing 03_shell_collapsed_sidebar.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "03_shell_collapsed_sidebar.png"),
  });

  // Expand sidebar back
  const expandButton = page.locator('button[aria-label*="Expand sidebar"]').first();
  await expandButton.click();
  await page.waitForTimeout(300);

  // 4. Command Palette Overlay
  console.log("Opening Command Palette via shortcut...");
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(400);
  await page.keyboard.type("Developer");
  await page.waitForTimeout(300);
  console.log("Capturing 04_shell_command_palette.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "04_shell_command_palette.png"),
  });

  // 5. Navigate to Developer Mode via Enter key
  console.log("Executing command via Enter key...");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
  console.log("Capturing 05_shell_developer_mode.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "05_shell_developer_mode.png"),
  });

  // 6. Navigate to Settings
  console.log("Navigating to Settings via Ctrl+,...");
  await page.keyboard.press("Control+,");
  await page.waitForTimeout(500);
  console.log("Capturing 06_shell_settings.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "06_shell_settings.png"),
  });

  await browser.close();
  await new Promise((resolve) => previewServer.httpServer.close(resolve));
  console.log("All screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
