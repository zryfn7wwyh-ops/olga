import { defineConfig, devices } from "@playwright/test";
const PORT = Number(process.env.E2E_PORT ?? 3100);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
    // Плавная прокрутка (scroll-behavior: smooth) отключается при reduce — клики стабильнее.
    reducedMotion: "reduce",
  },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
    env: {
      LEAD_DELIVERY_MODE: "test",
      LEAD_ALLOW_TEST_MODE_IN_PRODUCTION: "true",
      LEAD_TEST_FILE: ".data/e2e-leads.jsonl",
      LEAD_RATE_LIMIT_MAX: "1000",
    },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
});
