import { createBdd, test } from 'playwright-bdd';
import { Page } from '@playwright/test';
import { GiftVoucherPage } from '../pages/GiftVoucherPage';
import { Mail7Page } from '../pages/Mail7Page';

const { Given, When, Then } = createBdd(test);

// Holds the data needed across steps within a single scenario
type ScenarioState = {
  selectedAmount: string;
  purchaserEmail: string;
  recipientEmail: string;
};

// Use WeakMap to isolate scenario state per Playwright page instance
const scenarioStateByPage = new WeakMap<Page, ScenarioState>();
const DEFAULT_GIFT_MESSAGE = 'Hi, enjoy your gift voucher!';

// Returns existing state for this page, or creates it with unique generated emails
function getScenarioState(page: Page): ScenarioState {
  let state = scenarioStateByPage.get(page);

  if (!state) {
    const suffix = Date.now().toString(36);
    const purchaserEmail = `phorest-test-${suffix}@mail7.app`;
    state = {
      selectedAmount: '',
      purchaserEmail,
      recipientEmail: purchaserEmail, // defaults to purchaser; overridden when sending to someone else
    };
    scenarioStateByPage.set(page, state);
  }

  return state;
}

// Appends '.00' if the amount has no decimal, to match the summary page format
function toDisplayAmount(amount: string): string {
  return amount.includes('.') ? amount : `${amount}.00`;
}

// Fills in the recipient details form using the pre-generated emails from state
async function enterRecipientDetails(
  page: Page,
  forename: string,
  surname: string,
  options?: { includeRecipient?: boolean; includeMessage?: boolean }
): Promise<void> {
  const state = getScenarioState(page);

  if (options?.includeRecipient) {
  // Generate a unique recipient email and store it so the summary verification uses the same address
    state.recipientEmail = `recipient-${Date.now().toString(36)}@mail7.app`;
  }

  await new GiftVoucherPage(page).enterRecipientDetails(state.purchaserEmail, forename, surname, {
    giftRecipientEmail: options?.includeRecipient ? state.recipientEmail : undefined,
    message: options?.includeMessage ? DEFAULT_GIFT_MESSAGE : undefined,
  });
}

// Navigates to the summary page, verifies the details, then confirms
async function goToSummaryAndConfirm(page: Page): Promise<void> {
  const { selectedAmount, purchaserEmail, recipientEmail } = getScenarioState(page);
  const displayAmount = toDisplayAmount(selectedAmount);
  const voucher = new GiftVoucherPage(page);

  await voucher.goToSummary();
  await voucher.verifySummaryDetails(displayAmount, displayAmount, purchaserEmail, recipientEmail);
  await voucher.confirmDetails();
}

Given('user navigates to the Phorest demo voucher page', async ({ page }) => {
  await new GiftVoucherPage(page).navigateToDemo();
});

When('user selects a voucher amount of {string}', async ({ page }, amount: string) => {
  getScenarioState(page).selectedAmount = amount;
  await new GiftVoucherPage(page).selectAmount(amount);
});

When('user selects a custom voucher amount of {string}', async ({ page }, amount: string) => {
  getScenarioState(page).selectedAmount = amount;
  await new GiftVoucherPage(page).selectCustomAmount(amount);
});

When(/^user verifies '?Send to me'? tab is selected$/, async ({ page }) => {
  await new GiftVoucherPage(page).verifyTabIsSelected('Send to me');
});

When("user selects 'Send to someone else' tab", async ({ page }) => {
  await new GiftVoucherPage(page).selectSendToSomeoneElseTab();
});

When('user enters email, forename {string} and surname {string}', async ({ page }, forename: string, surname: string) => {
  await enterRecipientDetails(page, forename, surname);
});

When('user enters email, forename {string}, surname {string}, recipient email and a message', async ({ page }, forename: string, surname: string) => {
  await enterRecipientDetails(page, forename, surname, { includeRecipient: true, includeMessage: true });
});

When('user enters email, forename {string}, surname {string} and recipient email without a message', async ({ page }, forename: string, surname: string) => {
  await enterRecipientDetails(page, forename, surname, { includeRecipient: true });
});

When('user proceeds to the summary page to confirm details', async ({ page }) => {
  await goToSummaryAndConfirm(page);
});

When('user proceeds to the summary page, clicks edit and updates the voucher amount to be {string}', async ({ page }, updatedAmount: string) => {
  const state = getScenarioState(page);
  const voucher = new GiftVoucherPage(page);

  await voucher.goToSummary();
  await voucher.clickEdit();
  await voucher.selectAmount(updatedAmount);
  state.selectedAmount = updatedAmount;

  await goToSummaryAndConfirm(page);
});

When('user enters card number {string}, expiry {string}, CVC {string}', async ({ page }, cardNumber: string, expiry: string, cvc: string) => {
  const voucher = new GiftVoucherPage(page);
  await voucher.enterCardDetails(cardNumber, expiry, cvc);
  await voucher.clickPayButton();
});

Then('the confirmation page should display the voucher value and number', async ({ page }) => {
  const { selectedAmount } = getScenarioState(page);
  await new GiftVoucherPage(page).verifyConfirmationPage(selectedAmount);
});

Then('the user should receive a voucher email with a purchase receipt', async ({ page }) => {
  const { purchaserEmail, recipientEmail, selectedAmount } = getScenarioState(page);
  const mail7 = new Mail7Page(page);
  const purchaserMailbox = purchaserEmail.split('@')[0];
  const recipientMailbox = recipientEmail.split('@')[0];
  const voucherSubject = Mail7Page.voucherSubject(selectedAmount);

  if (purchaserMailbox === recipientMailbox) {
    // Buying for self - both receipt and voucher land in the same inbox
    await mail7.checkMailboxForSubjects(purchaserMailbox, [Mail7Page.receiptSubject, voucherSubject]);
  } else {
    // Buying for someone else - receipt to purchaser, voucher to recipient
    await mail7.checkMailboxForSubject(purchaserMailbox, Mail7Page.receiptSubject);
    await mail7.checkMailboxForSubject(recipientMailbox, voucherSubject);
  }
});

When('user enters invalid email {string}, forename {string} and surname {string}', async ({ page }, invalidEmail: string, forename: string, surname: string) => {
  await new GiftVoucherPage(page).enterRecipientDetails(invalidEmail, forename, surname);
});

Then('the user should not be able to proceed to the summary page', async ({ page }) => {
  await new GiftVoucherPage(page).verifyCannotProceedToSummary();
});

Then('an error message should be displayed indicating the email format is invalid', async ({ page }) => {
  await new GiftVoucherPage(page).assertInvalidEmailErrorMessage();
});

Then('an error message should be displayed indicating the custom amount is invalid', async ({ page }) => {
  await new GiftVoucherPage(page).assertInvalidCustomAmountErrorMessage();
});

Then('a payment failure message should be displayed', async ({ page }) => {
  await new GiftVoucherPage(page).assertPaymentFailureMessage();
});
