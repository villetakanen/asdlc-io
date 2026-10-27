import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:14321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Own the preview server: never silently test another local project.
    command: 'pnpm preview --host 127.0.0.1 --port 14321',
    url: 'http://127.0.0.1:14321',
    reuseExistingServer: false,
  },
});
