import { Page, Locator, FrameLocator, expect } from '@playwright/test';

export class GiftVoucherPage {
  readonly page: Page;
  static readonly demoUrl = 'https://gift-cards.phorest.com/salons/demo#';

  // Locators
  readonly tabsContainer: Locator;
  readonly recipientEmailInput: Locator;
  readonly recipientNameInput: Locator;
  readonly recipientSurnameInput: Locator;
  readonly giftRecipientEmailInput: Locator;
  readonly messageInput: Locator;
  readonly otherAmountRadio: Locator;
  readonly customAmountInput: Locator;
  readonly checkoutButton: Locator;
  readonly sendToSomeoneElseTab: Locator;
  readonly confirmVoucherValue: Locator;
  readonly confirmTotalAmount: Locator;
  readonly confirmPurchaserEmail: Locator;
  readonly confirmRecipientEmail: Locator;
  readonly confirmDetailsButton: Locator;
  readonly confirmationMessage: Locator;
  readonly stripeFrame: FrameLocator;
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCvcInput: Locator;
  readonly payButton: Locator;
  readonly editButton: Locator;
  readonly invalidEmailErrorMessage: Locator;
  readonly invalidCustomAmountErrorMessage: Locator;
  readonly paymentFailureMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.tabsContainer = page.locator('[data-controller="tabs"]');
    this.recipientEmailInput = page.getByRole('textbox', { name: 'the receipt will be sent here' });
    this.recipientNameInput = page.getByRole('textbox', { name: 'first name' });
    this.recipientSurnameInput = page.getByRole('textbox', { name: 'last name' });
    this.giftRecipientEmailInput = page.getByRole('textbox', { name: 'gift voucher will be sent here' });
    this.messageInput = page.getByRole('textbox', { name: 'type your message here eg. Hi' });
    this.otherAmountRadio = page.getByRole('radio', { name: 'Other' });
    this.customAmountInput = page.getByRole('spinbutton');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.sendToSomeoneElseTab = page.getByRole('link', { name: 'Send to someone else' });
    this.confirmVoucherValue = page.locator('#confirm-voucher-value');
    this.confirmTotalAmount = page.locator('#confirm-total-amount');
    this.confirmPurchaserEmail = page.locator('#confirm-purchaser-email');
    this.confirmRecipientEmail = page.locator('#confirm-recipient-email');
    this.confirmDetailsButton = page.getByRole('button', { name: 'Confirm Details' });
    this.confirmationMessage = page.getByText("Payment accepted, thank you! Your gift voucher has been sent. We've also sent");
    this.stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();
    this.cardNumberInput = this.stripeFrame.getByRole('textbox', { name: 'Credit or debit card number' });
    this.cardExpiryInput = this.stripeFrame.getByRole('textbox', { name: 'Credit or debit card expiration date' });
    this.cardCvcInput = this.stripeFrame.getByRole('textbox', { name: 'Credit or debit card CVC/CVV' });
    this.payButton = page.getByRole('button', { name: 'Pay' });
    this.editButton = page.getByRole('button', { name: 'Edit' });
    this.invalidEmailErrorMessage = page.getByText('Please enter a valid email');
    this.invalidCustomAmountErrorMessage = page.getByText('The minimum spend is €20 and');
    this.paymentFailureMessage = page.getByText('Your card has been declined.');
  }

  // Navigates to the demo voucher page with a single retry to reduce flakiness on slow initial loads
  async navigateToDemo() {
    for (let attempt = 0; attempt < 2; attempt++) {
      await this.page.goto(GiftVoucherPage.demoUrl, { waitUntil: 'domcontentloaded' });

      const amountOption = this.page.getByRole('radio', { name: '€50' });
      if (await amountOption.isVisible({ timeout: 10000 }).catch(() => false)) {
        return;
      }
    }

    await expect(this.page.getByRole('radio', { name: '€50' })).toBeVisible({ timeout: 10000 });
  }

  // Clicks one of the preset voucher amount radio buttons
  async selectAmount(amount: string) {
    await this.page.getByRole('radio', { name: amount }).click();
  }

  // Selects the "Other" radio and types a custom numeric amount, stripping any currency symbols first
  async selectCustomAmount(amount: string) {
    const normalisedAmount = amount.replace(/[^\d.]/g, '');

    if (!normalisedAmount) {
      throw new Error(`Invalid custom voucher amount: ${amount}`);
    }

    await this.otherAmountRadio.click();
    await this.customAmountInput.fill(normalisedAmount);
  }

  // Asserts the correct tab is active by checking both the data attribute on the container and the active CSS class on the tab link
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

  // Clicks the "Send to someone else" tab and verifies it becomes active
  async selectSendToSomeoneElseTab() {
    const tabName = 'Send to someone else';
    await this.sendToSomeoneElseTab.click();
    await this.verifyTabIsSelected(tabName);
  }

  // Fills in the recipient details form - giftRecipientEmail and message are only filled when provided
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

  // Clicks Checkout to navigate from the details form to the order summary page
  async goToSummary() {
    await this.checkoutButton.click();
  }

  // Asserts the Checkout button has the disabled CSS class, meaning the form is incomplete or invalid
  async verifyCannotProceedToSummary() {
    await expect(this.checkoutButton).toHaveClass(/btn-disabled/);
  }

  // Reads the text content of each summary field and asserts it matches the expected values
  async verifySummaryDetails(voucherValue: string, totalCost: string, purchaserEmail: string, recipientEmail: string) {
    await expect((await this.confirmVoucherValue.innerText()).trim()).toBe(voucherValue);
    await expect((await this.confirmTotalAmount.innerText()).trim()).toBe(totalCost);
    await expect((await this.confirmPurchaserEmail.innerText()).trim()).toBe(purchaserEmail);
    await expect((await this.confirmRecipientEmail.innerText()).trim()).toBe(recipientEmail);
  }

  // Clicks Confirm Details to proceed from the summary page to the payment form
  async confirmDetails() {
    await this.confirmDetailsButton.click();
  }

  // Fills card details inside Stripe's embedded iframe
  async enterCardDetails(cardNumber: string, expiry: string, cvc: string) {
    await this.cardNumberInput.fill(cardNumber);
    await this.cardExpiryInput.fill(expiry);
    await this.cardCvcInput.fill(cvc);
  }

  async clickPayButton() {
    await this.payButton.click();
  }

  // Asserts the success message is visible, then verifies the voucher code and the correct amount appear on the page
  async verifyConfirmationPage(expectedAmount: string) {
    await expect(this.confirmationMessage).toBeVisible({ timeout: 20000 });

    const voucherCode = this.page.getByText(/\b\d+\b/).first();
    await expect(voucherCode).toBeVisible({ timeout: 20000 });
    await expect(voucherCode).toHaveText(/\S+/, { timeout: 20000 });

    await expect(this.page.getByText('€').first()).toContainText(expectedAmount);
    await expect(this.page.getByText('€').nth(1)).toContainText(expectedAmount);
  }

  // Returns to the details form from the summary page to allow changes before payment
  async clickEdit() {
    await this.editButton.click();
  }

  // Asserts the inline email validation error is visible after submitting an invalid email address
  async assertInvalidEmailErrorMessage() {
    await expect(this.invalidEmailErrorMessage).toBeVisible();
  }

  // Asserts the minimum spend validation error is visible after entering an amount below the threshold
  async assertInvalidCustomAmountErrorMessage() {
    await expect(this.invalidCustomAmountErrorMessage).toBeVisible();
  }

  // Asserts Stripe's card declined message is visible after submitting an invalid card
  async assertPaymentFailureMessage() {
    await expect(this.paymentFailureMessage).toBeVisible({ timeout: 15000 });
  }
}

