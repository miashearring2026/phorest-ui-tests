import { Page, expect } from '@playwright/test';

export class MailSacPage {
  readonly page: Page;
  static readonly url = 'https://mailsac.com/';
  static readonly receiptSender = 'info@demo-ie-city-salon.phorest.com';
  static readonly voucherSender = 'info@city-salon.phorest.com';

  constructor(page: Page) {
    this.page = page;
  }

  async checkMailboxForSender(mailbox: string, senderEmail: string) {
    await this.page.goto(MailSacPage.url);
    await this.page.getByPlaceholder('mailbox').fill(mailbox);
    await this.page.getByRole('button', { name: 'Check the mail!' }).click();

    await expect(
      this.page.getByRole('cell', { name: senderEmail }).first()
    ).toBeVisible({ timeout: 30000 });
  }
}
