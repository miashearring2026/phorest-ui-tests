import { Page, Locator, expect } from '@playwright/test';

export class Mail7Page {
  // Locators
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly openInboxButton: Locator;
  readonly inboxHeading: Locator;

  // Constants
  static readonly receiptSubject = 'Your Receipt for City Salon';
  static readonly initialWaitMs = 11000;       // wait before first inbox check to allow email delivery
  static readonly inboxPollTimeoutMs = 60000;
  static readonly inboxPollIntervalMs = 3000;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.getByRole('textbox', { name: 'username' });
    this.openInboxButton = page.getByRole('button', { name: 'Open Inbox' });
    this.inboxHeading = page.getByRole('heading', { name: 'Inbox' });
  }

  // Builds the expected voucher email subject line from the voucher amount
  static voucherSubject(amount: string): string {
    const numeric = parseFloat(amount.replace('€', '').trim()).toFixed(2);
    return `You've been sent a \u20ac${numeric}`;
  }

  // Navigates to Mail7, enters the mailbox name, opens the inbox, and waits for the heading to confirm it loaded
  // Retries once on transient network errors (e.g. ERR_NETWORK_CHANGED, chrome-error redirect)
  private async openInbox(mailbox: string): Promise<void> {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await this.page.goto('https://portal.mail7.app/', { waitUntil: 'domcontentloaded' });

        // If Chrome redirected to an error page, treat it as a retryable failure
        if (this.page.url().startsWith('chrome-error://')) {
          throw new Error('Navigation redirected to chrome-error page');
        }

        await this.usernameInput.fill(mailbox);
        await this.openInboxButton.click();
        await expect(this.inboxHeading).toBeVisible();
        return;
      } catch (err) {
        if (attempt === 1) throw err;
        await this.page.waitForTimeout(2000);
      }
    }
  }

  // Checks whether every expected subject line is currently visible in the open inbox
  private async hasAllSubjects(subjects: string[]): Promise<boolean> {
    for (const subject of subjects) {
      const locator = this.page.getByText(subject).first();
      if (!(await locator.isVisible())) {
        return false;
      }
    }
    return true;
  }

  // Convenience wrapper for checking a single subject
  async checkMailboxForSubject(mailbox: string, subject: string): Promise<void> {
    await this.checkMailboxForSubjects(mailbox, [subject]);
  }

  // Opens the mailbox and polls for all expected subjects, retrying at intervals to handle mail delivery delays
  async checkMailboxForSubjects(mailbox: string, subjects: string[]): Promise<void> {
    // Wait before the first check to give the mail server time to deliver
    await this.page.waitForTimeout(Mail7Page.initialWaitMs);

    // Poll the inbox — mail delivery can be delayed
    const maxAttempts = Math.ceil(Mail7Page.inboxPollTimeoutMs / Mail7Page.inboxPollIntervalMs);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await this.openInbox(mailbox);

      if (await this.hasAllSubjects(subjects)) {
        return;
      }

      if (attempt < maxAttempts - 1) {
        await this.page.waitForTimeout(Mail7Page.inboxPollIntervalMs);
      }
    }

    throw new Error(`Subjects not found after ${maxAttempts} attempts: ${subjects.join(', ')}`);}
  }
