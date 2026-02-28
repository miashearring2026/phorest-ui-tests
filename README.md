## Overview

This project demonstrates an end-to-end automation approach for a real-world checkout flow, including:

- UI interaction
- Cross-page state handling
- Third-party iframe interaction (Stripe)
- Asynchronous email verification with polling
- Flakiness mitigation strategies

# Phorest UI Tests

End-to-end test suite for the gift voucher purchase flow built using Playwright and playwright-bdd.

The suite covers:

- Standard voucher purchases
- Custom voucher amounts
- "Send to me" and "Send to someone else" flows
- Editing voucher details before payment
- Validation scenarios (email + minimum amount)
- Negative payment flow
- Email verification via disposable inbox polling

## Tech Stack

- Playwright
- playwright-bdd
- TypeScript
- Mail verification via Mail7

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

After modifying `.feature` files or step definitions, regenerate the Playwright specs:

```bash
npm run bddgen
```

## Run Tests

Run all tests on Chromium:

```bash
npm run test:chromium
```

Run GiftVoucher feature only:

```bash
npm run test:giftvoucher
```

Run a specific scenario by grep:

```bash
npx playwright test .features-gen/features/GiftVoucher.feature.spec.js --project=chromium --grep "€100"
```

## HTML Report

After execution:

```bash
npx playwright show-report
```

The report is generated in `playwright-report/`.

If auto-open does not work, manually open `playwright-report/index.html`.

## Project Structure

```
features/           - Gherkin feature files
step_definitions/   - BDD step definitions
pages/              - Page Object Model classes
.features-gen/      - Generated Playwright specs
```

## Design Notes

- Scenario state is isolated per Playwright `Page` instance using a `WeakMap`, preventing cross-test contamination.
- Purchaser and recipient emails are auto-generated per scenario using a timestamp suffix (e.g. `phorest-test-lk9x2a@mail7.app`) to ensure clean inbox isolation.
- Email verification uses polling with retry logic to handle delivery delays.
- Navigation includes light retry logic to reduce flakiness on initial page load.
- Stripe payment fields are handled via frame locators to correctly interact with embedded secure inputs.

## Email Verification

Email checks are performed via [Mail7](https://portal.mail7.app), a public disposable inbox service.

- No API key required
- Inbox is accessed via UI
- Polling mechanism retries for up to 30 seconds

If email checks fail intermittently, the polling constants in `Mail7Page.ts` can be adjusted:

- `initialWaitMs`
- `inboxPollTimeoutMs`
- `inboxPollIntervalMs`