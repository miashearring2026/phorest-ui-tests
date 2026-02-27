import { createBdd, test } from 'playwright-bdd';
import { GiftVoucherPage } from '../pages/GiftVoucherPage';
import { MailSacPage } from '../pages/MailSacPage';

const { Given, When, Then } = createBdd(test);

let selectedAmount: string;
let purchaserEmail: string;
let recipientEmail: string;
const DEFAULT_GIFT_MESSAGE = 'Hi, enjoy your gift voucher!';

function toSummaryAmount(amount: string): string {
  if (amount.includes('.')) {
    return amount;
  }

  return `${amount}.00`;
}

Given('user navigates to the Phorest demo voucher page', async ({ page }) => {
  const voucher = new GiftVoucherPage(page);
  await voucher.navigateToDemo();
});

When('user selects a voucher amount of {string}', async ({ page }, amount: string) => {
  selectedAmount = amount;
  const voucher = new GiftVoucherPage(page);
  await voucher.selectAmount(amount);
});

When(/^user verifies '?Send to me'? tab is selected$/, async ({ page }) => {
  const voucher = new GiftVoucherPage(page);
  await voucher.verifyTabIsSelected('Send to me');
});

When("user selects 'Send to someone else' tab", async ({ page }) => {
  const voucher = new GiftVoucherPage(page);
  await voucher.selectSendToSomeoneElseTab();
});

When('user enters email {string}, forename {string} and surname {string}', async ({ page }, email: string, forename: string, surname: string) => {
  purchaserEmail = email;
  recipientEmail = email;
  const voucher = new GiftVoucherPage(page);
  await voucher.enterRecipientDetails(email, forename, surname);
});

When('user proceeds to the summary page to confirm details', async ({ page }) => {
  const voucher = new GiftVoucherPage(page);
  const expectedVoucher = toSummaryAmount(selectedAmount);
  const expectedTotal = toSummaryAmount(selectedAmount);

  await voucher.goToSummary();
  await voucher.verifySummaryDetails(expectedVoucher, expectedTotal, purchaserEmail, recipientEmail);
  await voucher.confirmDetails();
});

When('user enters card number {string}, expiry {string}, CVC {string}', async ({ page }, cardNumber: string, expiry: string, cvc: string) => {
  const voucher = new GiftVoucherPage(page);
  await voucher.enterCardDetails(cardNumber, expiry, cvc);
  await voucher.clickPayButton();
});

Then('the confirmation page should display the voucher value and number', async ({ page }) => {
  const voucher = new GiftVoucherPage(page);
  await voucher.verifyConfirmationPage(selectedAmount);
});

Then('the user should receive a voucher email with a purchase receipt', async ({ page }) => {
  const mailSac = new MailSacPage(page);
  const purchaserMailbox = purchaserEmail.split('@')[0];
  const recipientMailbox = recipientEmail.split('@')[0];

  await mailSac.checkMailboxForSender(purchaserMailbox, MailSacPage.receiptSender);
  await mailSac.checkMailboxForSender(recipientMailbox, MailSacPage.voucherSender);
});

When('user enters email {string}, forename {string}, surname {string}, recipient email {string} and a message', async ({ page }, email: string, forename: string, surname: string, recipientEmailParam: string) => {
  purchaserEmail = email;
  recipientEmail = recipientEmailParam;
  const voucher = new GiftVoucherPage(page);
  await voucher.enterRecipientDetails(email, forename, surname, {
    giftRecipientEmail: recipientEmailParam,
    message: DEFAULT_GIFT_MESSAGE,
  });
});

