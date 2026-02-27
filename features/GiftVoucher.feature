@GiftVoucher
@timeout:60000
Feature: Gift Voucher Purchase

    Background:
        Given user navigates to the Phorest demo voucher page

    @smoke @happy-path
    Scenario: Successfully purchase a €50 gift voucher
    
        When user selects a voucher amount of "€50"
        And user verifies 'Send to me' tab is selected
        And user enters email "phorest-test-123x@mailsac.com", forename "Phorest" and surname "Test"
        And user proceeds to the summary page to confirm details
        And user enters card number "4111 1111 1111 1111", expiry "12/26", CVC "999" 
        Then the confirmation page should display the voucher value and number
        And the user should receive a voucher email with a purchase receipt

    @smoke @happy-path
    Scenario: Successfully purchase a €100 gift voucher for someone else
    
        When user selects a voucher amount of "€100"
        And user selects 'Send to someone else' tab
        And user enters email "phorest-test-123x@mailsac.com", forename "Phorest", surname "Test", recipient email "recipient@mailsac.com" and a message
        And user proceeds to the summary page to confirm details
        And user enters card number "4111 1111 1111 1111", expiry "12/26", CVC "999" 
        Then the confirmation page should display the voucher value and number
        And the user should receive a voucher email with a purchase receipt


