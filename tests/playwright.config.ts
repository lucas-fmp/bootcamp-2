import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: __dirname,
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
});
