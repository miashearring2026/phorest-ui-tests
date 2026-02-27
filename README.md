# Phorest UI Tests

Playwright + `playwright-bdd` test suite for gift voucher purchase flows.

## Quick Start

```bash
npm ci
npm run bddgen
npm run test:giftvoucher
```

If you prefer to run directly without npm scripts:

```bash
npx playwright test --project=chromium
```

## Prerequisites

- Node.js 18+
- npm

## Setup

Install dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install --with-deps
```

## Generate BDD Specs

After changing `.feature` files or step definitions, regenerate specs:

```bash
npm run bddgen
```

## Run Tests

Run all tests on Chromium:

```bash
npm run test:chromium
```

Run GiftVoucher feature on Chromium:

```bash
npm run test:giftvoucher
```

Run a specific scenario by grep:

```bash
npx playwright test .features-gen/features/GiftVoucher.feature.spec.js --project=chromium --grep "€100"
```

## HTML Report

Generate and open the Playwright HTML report after a test run:

```bash
npx playwright show-report
```

The report is generated in `playwright-report/`.

If auto-open does not work, open `playwright-report/index.html` in your browser.

## Project Structure

- `features/` - Gherkin feature files
- `step_definitions/` - BDD step definitions
- `pages/` - Page objects
- `.features-gen/` - generated Playwright specs (from `bddgen`)

## Notes

- Always run `npm run bddgen` before test execution after changing feature/step files.
- Mail provider checks (`mailsac.com`) can occasionally fail due to transient network issues. Re-running the test usually resolves this.
