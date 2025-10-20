import { test, expect, chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { mkdtemp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const extensionPath = path.resolve(__dirname, "..", "dist", "extension");

test("content script destaca links e popup pinga background", async () => {
  expect(
    fs.existsSync(extensionPath),
    "dist/extension inexistente. Execute `npm run build` antes dos testes."
  ).toBeTruthy();

  const userDataDir = await mkdtemp(path.join(os.tmpdir(), "pw-extension-"));

  let context;
  try {
    context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--no-sandbox",
      ],
    });

    const page = await context.newPage();
    await page.goto("https://example.com");
    await page.waitForLoadState("domcontentloaded");

    const outlineColor = await page.evaluate(() => {
      const firstLink = document.querySelector("a");
      return firstLink ? getComputedStyle(firstLink).outlineColor : null;
    });

    expect(outlineColor).toBe("rgb(236, 0, 137)");

    let serviceWorker = context.serviceWorkers()[0];
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent("serviceworker");
    }
    const extensionId = new URL(serviceWorker.url()).host;

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/src/popup/popup.html`);
    await popup.click("#ping");
    await expect(popup.locator("#status")).toContainText("Background está vivo");
    await popup.close();
  } finally {
    if (context) {
      await context.close();
    }
    await rm(userDataDir, { recursive: true, force: true });
  }
});
