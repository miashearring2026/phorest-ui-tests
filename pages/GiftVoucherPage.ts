import { Page, Locator, expect } from '@playwright/test';

export class GiftVoucherPage {
  readonly page: Page;
  static readonly demoUrl = 'https://gift-cards.phorest.com/salons/demo#';

  // Locators
  readonly tabsContainer: Locator;
  readonly recipientNameInput: Locator;
  readonly recipientEmailInput: Locator;
  readonly recipientSurnameInput: Locator;
  readonly giftRecipientEmailInput: Locator;
  readonly messageInput: Locator;
  readonly checkoutButton: Locator;
  readonly confirmVoucherValue: Locator;
  readonly confirmTotalAmount: Locator;
  readonly confirmPurchaserEmail: Locator;
  readonly confirmRecipientEmail: Locator;
  readonly confirmDetailsButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.tabsContainer = page.locator('[data-controller="tabs"]');
    this.recipientEmailInput = page.getByRole('textbox', { name: 'the receipt will be sent here' });
    this.recipientNameInput = page.getByRole('textbox', { name: 'first name' });
    this.recipientSurnameInput = page.getByRole('textbox', { name: 'last name' });
    this.giftRecipientEmailInput = page.getByRole('textbox', { name: 'gift voucher will be sent here' });
    this.messageInput = page.getByRole('textbox', { name: 'type your message here eg. Hi' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.confirmVoucherValue = page.locator('#confirm-voucher-value');
    this.confirmTotalAmount = page.locator('#confirm-total-amount');
    this.confirmPurchaserEmail = page.locator('#confirm-purchaser-email');
    this.confirmRecipientEmail = page.locator('#confirm-recipient-email');
    this.confirmDetailsButton = page.getByRole('button', { name: 'Confirm Details' });
  }

  async navigateToDemo() {
    await this.page.goto(GiftVoucherPage.demoUrl);
  }

  async selectAmount(amount: string) {
    await this.page.getByRole('radio', { name: amount }).click();
  }

  async verifyTabIsSelected(tabName: string) {
    const tabMap: Record<string, string> = {
      'Send to me': 'SEND_TO_MYSELF',
      'Send to someone else': 'SEND_TO_OTHER',
    };

    const tabValue = tabMap[tabName];
    if (!tabValue) {
      throw new Error(`Unknown tab name: ${tabName}`);
    }

    await expect(this.tabsContainer)
      .toHaveAttribute('data-tabs-selected-tab', tabValue);

    await expect(this.page.getByRole('link', { name: tabName })).toHaveClass(/border-brand/);
  }

  async selectSendToSomeoneElseTab() {
    const tabName = 'Send to someone else';
    await this.page.getByRole('link', { name: tabName }).click();
    await this.verifyTabIsSelected(tabName);
  }

  async enterRecipientDetails(
    email: string,
    forename: string,
    surname: string,
    options?: { giftRecipientEmail?: string; message?: string }
  ) {
    await this.recipientEmailInput.fill(email);
    await this.recipientNameInput.fill(forename);
    await this.recipientSurnameInput.fill(surname);

    if (options?.giftRecipientEmail) {
      await this.giftRecipientEmailInput.fill(options.giftRecipientEmail);
    }

    if (options?.message) {
      await this.messageInput.fill(options.message);
    }
  }

  async goToSummary() {
    await this.checkoutButton.click();
  }

  async verifySummaryDetails(voucherValue: string, totalCost: string, purchaserEmail: string, recipientEmail: string) {
    await expect((await this.confirmVoucherValue.innerText()).trim()).toBe(voucherValue);
    await expect((await this.confirmTotalAmount.innerText()).trim()).toBe(totalCost);
    await expect((await this.confirmPurchaserEmail.innerText()).trim()).toBe(purchaserEmail);
    await expect((await this.confirmRecipientEmail.innerText()).trim()).toBe(recipientEmail);
  }

  async confirmDetails() {
    await this.confirmDetailsButton.click();
  }

  async enterCardDetails(cardNumber: string, expiry: string, cvc: string) {
    const stripeFrame = this.page.locator('iframe[name^="__privateStripeFrame"]').first().contentFrame();

    await stripeFrame
      .getByRole('textbox', { name: 'Credit or debit card number' })
      .fill(cardNumber);

    await stripeFrame
      .getByRole('textbox', { name: 'Credit or debit card expiration date' })
      .fill(expiry);

    await stripeFrame
      .getByRole('textbox', { name: 'Credit or debit card CVC/CVV' })
      .fill(cvc);
  }

  async clickPayButton() {
    await this.page.getByRole('button', { name: 'Pay' }).click();
  }

  async verifyConfirmationPage(expectedAmount: string) {
    await expect(
      this.page.getByText("Payment accepted, thank you! Your gift voucher has been sent. We've also sent")
    ).toBeVisible({ timeout: 20000 });

    const voucherCode = this.page.getByText(/\b\d+\b/).first();
    await expect(voucherCode).toBeVisible({ timeout: 20000 });
    await expect(voucherCode).toHaveText(/\S+/, { timeout: 20000 });

    await expect(this.page.getByText('€').first()).toContainText(expectedAmount);
    await expect(this.page.getByText('€').nth(1)).toContainText(expectedAmount);
  }
}

