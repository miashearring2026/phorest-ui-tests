// Generated from: features\GiftVoucher.feature
import { test } from "playwright-bdd";

test.describe('Gift Voucher Purchase', () => {
  test.describe.configure({"timeout":60000});

  test.beforeEach('Background', async ({ Given, page }, testInfo) => { if (testInfo.error) return;
    await Given('user navigates to the Phorest demo voucher page', null, { page }); 
  });
  
  test('Successfully purchase a €50 gift voucher', { tag: ['@GiftVoucher', '@timeout:60000', '@smoke', '@happy-path'] }, async ({ When, Then, And, page }) => { 
    await When('user selects a voucher amount of "€50"', null, { page }); 
    await And('user verifies \'Send to me\' tab is selected', null, { page }); 
    await And('user enters email "phorest-test-123x@mailsac.com", forename "Phorest" and surname "Test"', null, { page }); 
    await And('user proceeds to the summary page to confirm details', null, { page }); 
    await And('user enters card number "4111 1111 1111 1111", expiry "12/26", CVC "999"', null, { page }); 
    await Then('the confirmation page should display the voucher value and number', null, { page }); 
    await And('the user should receive a voucher email with a purchase receipt', null, { page }); 
  });

  test('Successfully purchase a €100 gift voucher for someone else', { tag: ['@GiftVoucher', '@timeout:60000', '@smoke', '@happy-path'] }, async ({ When, Then, And, page }) => { 
    await When('user selects a voucher amount of "€100"', null, { page }); 
    await And('user selects \'Send to someone else\' tab', null, { page }); 
    await And('user enters email "phorest-test-123x@mailsac.com", forename "Phorest", surname "Test", recipient email "recipient@mailsac.com" and a message', null, { page }); 
    await And('user proceeds to the summary page to confirm details', null, { page }); 
    await And('user enters card number "4111 1111 1111 1111", expiry "12/26", CVC "999"', null, { page }); 
    await Then('the confirmation page should display the voucher value and number', null, { page }); 
    await And('the user should receive a voucher email with a purchase receipt', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\GiftVoucher.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":9,"tags":["@GiftVoucher","@timeout:60000","@smoke","@happy-path"],"steps":[{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given user navigates to the Phorest demo voucher page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When user selects a voucher amount of \"€50\"","stepMatchArguments":[{"group":{"start":33,"value":"\"€50\"","children":[{"start":34,"value":"€50","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"And user verifies 'Send to me' tab is selected","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"And user enters email \"phorest-test-123x@mailsac.com\", forename \"Phorest\" and surname \"Test\"","stepMatchArguments":[{"group":{"start":18,"value":"\"phorest-test-123x@mailsac.com\"","children":[{"start":19,"value":"phorest-test-123x@mailsac.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":60,"value":"\"Phorest\"","children":[{"start":61,"value":"Phorest","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":82,"value":"\"Test\"","children":[{"start":83,"value":"Test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"And user proceeds to the summary page to confirm details","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"And user enters card number \"4111 1111 1111 1111\", expiry \"12/26\", CVC \"999\"","stepMatchArguments":[{"group":{"start":24,"value":"\"4111 1111 1111 1111\"","children":[{"start":25,"value":"4111 1111 1111 1111","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":54,"value":"\"12/26\"","children":[{"start":55,"value":"12/26","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":67,"value":"\"999\"","children":[{"start":68,"value":"999","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then the confirmation page should display the voucher value and number","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And the user should receive a voucher email with a purchase receipt","stepMatchArguments":[]}]},
  {"pwTestLine":21,"pickleLine":20,"tags":["@GiftVoucher","@timeout:60000","@smoke","@happy-path"],"steps":[{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given user navigates to the Phorest demo voucher page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"When user selects a voucher amount of \"€100\"","stepMatchArguments":[{"group":{"start":33,"value":"\"€100\"","children":[{"start":34,"value":"€100","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"And user selects 'Send to someone else' tab","stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"And user enters email \"phorest-test-123x@mailsac.com\", forename \"Phorest\", surname \"Test\", recipient email \"recipient@mailsac.com\" and a message","stepMatchArguments":[{"group":{"start":18,"value":"\"phorest-test-123x@mailsac.com\"","children":[{"start":19,"value":"phorest-test-123x@mailsac.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":60,"value":"\"Phorest\"","children":[{"start":61,"value":"Phorest","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":79,"value":"\"Test\"","children":[{"start":80,"value":"Test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":103,"value":"\"recipient@mailsac.com\"","children":[{"start":104,"value":"recipient@mailsac.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":25,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"And user proceeds to the summary page to confirm details","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":26,"keywordType":"Action","textWithKeyword":"And user enters card number \"4111 1111 1111 1111\", expiry \"12/26\", CVC \"999\"","stepMatchArguments":[{"group":{"start":24,"value":"\"4111 1111 1111 1111\"","children":[{"start":25,"value":"4111 1111 1111 1111","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":54,"value":"\"12/26\"","children":[{"start":55,"value":"12/26","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":67,"value":"\"999\"","children":[{"start":68,"value":"999","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":27,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"Then the confirmation page should display the voucher value and number","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"And the user should receive a voucher email with a purchase receipt","stepMatchArguments":[]}]},
]; // bdd-data-end