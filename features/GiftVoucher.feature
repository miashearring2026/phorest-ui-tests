@GiftVoucher
@timeout:180000
Feature: Gift Voucher Purchase

    Background:
        Given user navigates to the Phorest demo voucher page

    @smoke @happy-path
    Scenario: Successfully purchase a €50 gift voucher
    
        When user selects a voucher amount of "€50"
        And user verifies 'Send to me' tab is selected
        And user enters email, forename "Phorest" and surname "Test"
        And user proceeds to the summary page to confirm details
        And user enters card number "4111 1111 1111 1111", expiry "12/26", CVC "999" 
        Then the confirmation page should display the voucher value and number
        And the user should receive a voucher email with a purchase receipt

    @happy-path
    Scenario: Successfully purchase a €100 gift voucher for someone else with personalised message
    
        When user selects a voucher amount of "€100"
        And user selects 'Send to someone else' tab
        And user enters email, forename "Phorest", surname "Test", recipient email and a message
        And user proceeds to the summary page to confirm details
        And user enters card number "4111 1111 1111 1111", expiry "12/26", CVC "999" 
        Then the confirmation page should display the voucher value and number
        And the user should receive a voucher email with a purchase receipt

    @happy-path
    Scenario: Successfully purchase a €150 gift voucher for someone else without personalised message
    
        When user selects a voucher amount of "€150"
        And user selects 'Send to someone else' tab
        And user enters email, forename "Phorest", surname "Test" and recipient email without a message
        And user proceeds to the summary page to confirm details
        And user enters card number "4111 1111 1111 1111", expiry "12/26", CVC "999" 
        Then the confirmation page should display the voucher value and number
        And the user should receive a voucher email with a purchase receipt

    @happy-path
    Scenario: Successfully purchase a custom voucher amount
    
        When user selects a custom voucher amount of "€200"
        And user verifies 'Send to me' tab is selected
        And user enters email, forename "Phorest" and surname "Test"
        And user proceeds to the summary page to confirm details
        And user enters card number "4111 1111 1111 1111", expiry "12/26", CVC "999" 
        Then the confirmation page should display the voucher value and number
        And the user should receive a voucher email with a purchase receipt

    @happy-path
    Scenario: User can edit gift voucher details from the summary page before payment
        When user selects a voucher amount of "€50"
        And user verifies 'Send to me' tab is selected
        And user enters email, forename "Phorest" and surname "Test"
        And user proceeds to the summary page, clicks edit and updates the voucher amount to be "€100"
        And user enters card number "4111 1111 1111 1111", expiry "12/26", CVC "999" 
        Then the confirmation page should display the voucher value and number
        And the user should receive a voucher email with a purchase receipt

    @validation
    Scenario: User cannot proceed with invalid email format
        When user selects a voucher amount of "€50"
        And user verifies 'Send to me' tab is selected
        And user enters invalid email "invalid-email", forename "Phorest" and surname "Test"
        Then an error message should be displayed indicating the email format is invalid
        And the user should not be able to proceed to the summary page

    @validation
    Scenario: User cannot proceed without required recipient fields
        When user selects a voucher amount of "€100"
        And user selects 'Send to someone else' tab
        Then the user should not be able to proceed to the summary page

    @validation
    Scenario: User cannot proceed when a custom amount below minimum value is entered

        When user selects a custom voucher amount of "€10"
        And user verifies 'Send to me' tab is selected
        And user enters email, forename "Phorest" and surname "Test"
        Then an error message should be displayed indicating the custom amount is invalid
        And the user should not be able to proceed to the summary page

    @negative
    Scenario: Payment fails with invalid card number

        When user selects a voucher amount of "€50"
        And user verifies 'Send to me' tab is selected
        And user enters email, forename "Phorest" and surname "Test"
        And user proceeds to the summary page to confirm details
        And user enters card number "4000 0000 0000 0002", expiry "12/26", CVC "999"
        Then a payment failure message should be displayed
