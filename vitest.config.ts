import { defineConfig } from 'vitest/config';

/**
 * Vitest keeps a focused config so the test runner does not load the application-only
 * React and Tailwind plugins. Pure logic in src/lib needs no DOM; component tests opt
 * in with a `@vitest-environment jsdom` directive at the top of the file.
 */
export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    restoreMocks: true,
    // Managed runners can report many host CPUs while enforcing a smaller CPU quota.
    maxWorkers: 2,
    testTimeout: 20_000,
    include: ['src/**/*.test.{ts,tsx}'],
    // Defensive while the suite is small: an empty run should not hard-fail.
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      // Correctness-critical modules under the coverage gate. The trust model and
      // scoring engine (src/lib) are placeholders today and join the gate once they
      // are implemented in Fase 1; see docs/ROADMAP.md.
      include: ['src/rules/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/*.d.ts'],
      reportsDirectory: 'coverage',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      reportOnFailure: true,
      thresholds: {
        lines: 80,
        statements: 80,
        branches: 70,
        functions: 90,
        autoUpdate: false
      }
    }
  }
});
